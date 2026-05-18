import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';
import { getAICompletion } from '@/lib/ai';
import { checkRateLimit, RateLimitError } from '@/lib/ai';
import {
  REVIEW_SUMMARY_SYSTEM_PROMPT,
  REVIEW_SUMMARY_USER_PROMPT,
} from '@/lib/ai/prompts/review-summary';
import { products } from '../../../../const/products';

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 },
      );
    }

    // Check for cached summary
    const cachedSummary = await prisma.reviewSummary.findUnique({
      where: { productId },
    });

    if (cachedSummary) {
      // Check if summary is still valid (less than 24 hours old)
      const hoursSinceUpdate =
        (Date.now() - cachedSummary.updatedAt.getTime()) / (1000 * 60 * 60);

      if (hoursSinceUpdate < 24) {
        return NextResponse.json(cachedSummary);
      }
    }

    // Need to generate new summary - return cached if exists, trigger generation
    if (cachedSummary) {
      // Return stale data but trigger background regeneration
      generateAndCacheSummary(productId).catch(console.error);
      return NextResponse.json(cachedSummary);
    }

    return NextResponse.json({ error: 'No summary available yet' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching review summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review summary' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 },
      );
    }

    // Rate limiting
    try {
      checkRateLimit(`review-summary:${productId}`, {
        maxRequests: 5,
        windowMs: 60 * 60 * 1000, // 1 hour
      });
    } catch (error) {
      if (error instanceof RateLimitError) {
        return NextResponse.json({ error: error.message }, { status: 429 });
      }
      throw error;
    }

    const summary = await generateAndCacheSummary(productId);

    if (!summary) {
      return NextResponse.json(
        { error: 'Not enough reviews to generate summary' },
        { status: 400 },
      );
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error generating review summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate review summary' },
      { status: 500 },
    );
  }
}

async function generateAndCacheSummary(productId: string) {
  // Fetch reviews from the Review model (where user-submitted reviews are stored)
  const dbReviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
  });

  // Fallback: also check embedded product.reviews (e.g. from seed data)
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  const embeddedReviews = product?.reviews || [];

  // Merge both sources: DB reviews (user-submitted) + embedded reviews (seed/imported)
  const dbReviewItems = dbReviews.map((r) => ({ rating: r.rating, comment: r.comment }));
  const embeddedReviewItems = embeddedReviews.map((r) => ({ rating: r.rating, comment: r.comment }));
  const reviews = [...dbReviewItems, ...embeddedReviewItems];
  // Need at least 3 reviews to generate a meaningful summary
  if (reviews.length < 3) {
    return null;
  }

  // Get product title (from DB or hardcoded products)
  const productTitle =
    product?.title ||
    products.find((p) => p.id === productId)?.title ||
    'Product';

  // Generate summary using AI
  const userPrompt = REVIEW_SUMMARY_USER_PROMPT(productTitle, reviews);

  const aiResponse = await getAICompletion(
    [{ role: 'user', content: userPrompt }],
    {
      systemPrompt: REVIEW_SUMMARY_SYSTEM_PROMPT,
      model: 'gpt-4o-mini',
      maxTokens: 500,
      temperature: 0.3,
    },
  );

  // Parse the JSON response
  let parsedResponse;
  try {
    // Extract JSON from potential markdown code blocks
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedResponse = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found in response');
    }
  } catch {
    console.error('Failed to parse AI response:', aiResponse);
    throw new Error('Failed to parse AI response');
  }

  // Upsert the summary
  const summary = await prisma.reviewSummary.upsert({
    where: { productId },
    create: {
      productId,
      summary: parsedResponse.summary,
      sentiment: parsedResponse.sentiment,
      pros: parsedResponse.pros || [],
      cons: parsedResponse.cons || [],
      reviewCount: reviews.length,
    },
    update: {
      summary: parsedResponse.summary,
      sentiment: parsedResponse.sentiment,
      pros: parsedResponse.pros || [],
      cons: parsedResponse.cons || [],
      reviewCount: reviews.length,
    },
  });

  return summary;
}
