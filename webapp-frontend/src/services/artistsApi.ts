const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export type ArtistListItem = {
  id: string;
  name: string;
  craft: string;
  region: string;
  years: string;
  email: string;
  username: string | null;
};

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error((payload as { message?: string }).message || 'Request failed');
  }
  return response.json() as Promise<T>;
};

export const artistsApi = {
  getArtists: () => request<{ artists: ArtistListItem[] }>('/artists'),
  getArtistById: (id: string) => request<{ artist: ArtistListItem }>(`/artists/${id}`)
};
