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

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

const getAuthHeaders = (extra?: Record<string, string>) => {
  const raw = localStorage.getItem('lankaCraftAuthUser');
  if (!raw) return extra || {};
  try {
    const user = JSON.parse(raw) as { email?: string; role?: string; username?: string | null };
    return {
      ...(user.email ? { 'x-user-email': user.email } : {}),
      ...(user.role ? { 'x-user-role': user.role } : {}),
      ...(user.username ? { 'x-username': user.username } : {}),
      ...(extra || {})
    };
  } catch {
    return extra || {};
  }
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
    ...((init?.headers || {}) as Record<string, string>)
  };
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || 'Request failed');
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

export const reviewApi = {
  getReviews: (params: Record<string, string>) => {
    const q = new URLSearchParams(params).toString();
    return request<{ reviews: Review[]; stats: ReviewStats }>(`/reviews?${q}`, {
      headers: getAuthHeaders()
    });
  },
  getAdminReviews: (params: Record<string, string>) => {
    const q = new URLSearchParams(params).toString();
    return request<{ reviews: Review[]; workshops: string[] }>(`/reviews/admin?${q}`, {
      headers: getAuthHeaders()
    });
  },
  getMyReviews: () =>
    request<{ reviews: Review[]; stats: ReviewStats }>(
      '/reviews?mine=true&sortBy=newest&includeHidden=true',
      { headers: getAuthHeaders() }
    ),
  createReview: (body: Record<string, unknown>) =>
    request<Review>('/reviews', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    }),
  updateReview: (id: string, body: Record<string, unknown>) =>
    request<Review>(`/reviews/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    }),
  deleteReview: (id: string) =>
    request<void>(`/reviews/${id}`, { method: 'DELETE', headers: getAuthHeaders() }),
  reply: (id: string, text: string, artisanName?: string) =>
    request<Review>(`/reviews/${id}/reply`, {
      method: 'POST',
      headers: getAuthHeaders(artisanName ? { 'x-artist-name': artisanName } : {}),
      body: JSON.stringify({ text })
    }),
  markHelpful: (id: string) =>
    request<Review>(`/reviews/${id}/helpful`, { method: 'POST', headers: getAuthHeaders() }),
  moderate: (id: string, action: 'hide' | 'remove' | 'restore' | 'spam') =>
    request<Review>(`/reviews/${id}/moderate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action })
    })
};
