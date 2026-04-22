const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002'}/api`;

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error((payload as { message?: string }).message || 'Request failed');
  }

  return response.json() as Promise<T>;
};

export type AiReviewSummary = {
  artisanName: string;
  summary: string;
  providerNote?: string;
  highlights?: string[];
  cautions?: string[];
  ratingBreakdown?: {
    avgRating: number;
    total: number;
    distribution: Array<{ stars: number; count: number }>;
  } | null;
};

export const aiApi = {
  summarizeArtistReviews: (body: { artisanName: string; reviews: Array<{ rating: number; text: string }> }) =>
    request<AiReviewSummary>('/ai/review-summary', { method: 'POST', body: JSON.stringify(body) })
};
