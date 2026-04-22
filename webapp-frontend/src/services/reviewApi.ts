import api from '../api/axiosInstance';

export type ReviewStatus = 'active' | 'hidden' | 'flagged' | 'removed';

export interface ReviewPhoto {
  url: string;
  alt: string;
}

export interface ArtisanReply {
  text: string;
  date: string;
}

export interface Review {
  id: string;
  authorEmail?: string;
  touristName: string;
  touristInitials: string;
  touristColor: string;
  country: string;
  countryFlag: string;
  artisanName: string;
  workshopName: string;
  rating: number;
  text: string;
  photos: ReviewPhoto[];
  status: ReviewStatus;
  flagReason?: string;
  reportCount: number;
  helpful: number;
  edited: boolean;
  isOwn: boolean;
  canEdit?: boolean;
  artisanReply?: ArtisanReply | null;
  datePosted: string;
}

export interface ReviewStats {
  totalReviews: number;
  overallRating: number;
  ratingDistribution: Array<{ stars: number; count: number; pct: number }>;
}

export const reviewApi = {
  getReviews: (params: Record<string, string>) => 
    api.get('/reviews', { params }).then(res => res.data),

  getAdminReviews: (params: Record<string, string>) => 
    api.get('/reviews/admin', { params }).then(res => res.data),

  getMyReviews: () =>
    api.get('/reviews?mine=true&sortBy=newest&includeHidden=true').then(res => res.data),

  createReview: (body: Record<string, unknown>) =>
    api.post('/reviews', body).then(res => res.data),

  updateReview: (id: string, body: Record<string, unknown>) =>
    api.patch(`/reviews/${id}`, body).then(res => res.data),

  deleteReview: (id: string) =>
    api.delete(`/reviews/${id}`).then(res => res.data),

  reply: (id: string, text: string, artisanName?: string) =>
    api.post(`/reviews/${id}/reply`, { text }, {
      headers: artisanName ? { 'x-artist-name': artisanName } : {}
    }).then(res => res.data),

  markHelpful: (id: string) =>
    api.post(`/reviews/${id}/helpful`).then(res => res.data),

  moderate: (id: string, action: 'hide' | 'remove' | 'restore' | 'spam') =>
    api.post(`/reviews/${id}/moderate`, { action }).then(res => res.data)
};
