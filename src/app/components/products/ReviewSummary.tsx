'use client';

import React, { useEffect, useState } from 'react';
import { MdThumbUp, MdThumbDown, MdAutoAwesome } from 'react-icons/md';

type ReviewSummaryData = {
  id: string;
  productId: string;
  summary: string;
  sentiment: number;
  pros: string[];
  cons: string[];
  reviewCount: number;
  updatedAt: string;
};

interface ReviewSummaryProps {
  productId: string;
  reviewCount: number;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  productId,
  reviewCount,
}) => {
  const [summary, setSummary] = useState<ReviewSummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (reviewCount < 3) return;
    const controller = new AbortController();

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/review-summary?productId=${productId}`,
          {signal: controller.signal}
        );
        if (response.ok) {
          const data = await response.json();
          setSummary(data);
        } else if (response.status === 404) {
          // No summary exists yet, we can generate one
          setSummary(null);
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        console.error('Error fetching summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [productId, reviewCount]);

  const handleGenerateSummary = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/review-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate summary');
      }
    } catch (err) {
      setError('Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  // Don't show anything if not enough reviews
  if (reviewCount < 3) {
    return null;
  }

  if (loading) {
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdAutoAwesome className="text-purple-500" size={20} />
            <span className="text-sm text-gray-600">
              AI-powered review summary available
            </span>
          </div>
          <button
            onClick={handleGenerateSummary}
            disabled={generating}
            className="px-3 py-1 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed">
            {generating ? 'Generating...' : 'Generate Summary'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  }

  const sentimentColor =
    summary.sentiment >= 0.7
      ? 'text-green-600'
      : summary.sentiment >= 0.4
        ? 'text-yellow-600'
        : 'text-red-600';

  const sentimentLabel =
    summary.sentiment >= 0.7
      ? 'Mostly Positive'
      : summary.sentiment >= 0.4
        ? 'Mixed'
        : 'Mostly Negative';

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <MdAutoAwesome className="text-purple-500" size={20} />
        <h3 className="font-semibold text-slate-700">AI Review Summary</h3>
        <span className={`text-sm ${sentimentColor} font-medium`}>
          ({sentimentLabel})
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-4">{summary.summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summary.pros.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-2">
              <MdThumbUp className="text-green-500" size={16} />
              <span className="text-sm font-medium text-green-700">
                What customers love
              </span>
            </div>
            <ul className="space-y-1">
              {summary.pros.map((pro, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-1">
                  <span className="text-green-500 mt-1">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.cons.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-2">
              <MdThumbDown className="text-red-500" size={16} />
              <span className="text-sm font-medium text-red-700">
                Common concerns
              </span>
            </div>
            <ul className="space-y-1">
              {summary.cons.map((con, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-1">
                  <span className="text-red-500 mt-1">-</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Based on {summary.reviewCount} reviews
      </p>
    </div>
  );
};

export default ReviewSummary;
