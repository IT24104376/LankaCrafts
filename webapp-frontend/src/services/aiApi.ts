import api from '../api/axiosInstance';

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
  summarizeArtistReviews: async (body: { artisanName: string; reviews: Array<{ rating: number; text: string }> }) => {
    const response = await api.post<AiReviewSummary>('/ai/review-summary', body);
    return response.data;
  }
};
