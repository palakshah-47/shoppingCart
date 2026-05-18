export const REVIEW_SUMMARY_SYSTEM_PROMPT = `You are a helpful AI assistant that analyzes product reviews and provides concise summaries.

Your task is to analyze customer reviews and generate:
1. A brief overall summary (2-3 sentences)
2. A sentiment score from 0 to 1 (0 = very negative, 0.5 = neutral, 1 = very positive)
3. A list of pros (what customers love)
4. A list of cons (common concerns or complaints)

Guidelines:
- Be objective and balanced
- Extract actual themes from reviews, don't make things up
- Keep pros and cons to 3-5 items each
- If there aren't enough reviews to determine a pattern, indicate that
- Use natural language, avoid marketing speak`;

export const REVIEW_SUMMARY_USER_PROMPT = (
  productTitle: string,
  reviews: Array<{ rating: number; comment: string | null }>,
) => `Please analyze these reviews for the product "${productTitle}":

${reviews
  .map(
    (r, i) =>
      `Review ${i + 1} (Rating: ${r.rating}/5): ${r.comment || 'No comment provided'}`,
  )
  .join('\n\n')}

Respond in the following JSON format only:
{
  "summary": "Brief 2-3 sentence summary of the reviews",
  "sentiment": 0.75,
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2"]
}`;
