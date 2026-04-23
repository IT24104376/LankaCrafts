const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export type UserRole = 'tourist' | 'artist' | 'admin';

export interface AuthUser {
  email: string;
  role: UserRole;
  username: string | null;
}

const parseError = async (response: Response) => {
  const payload = await response.json().catch(() => ({}));
  return (payload as { message?: string }).message || 'Request failed';
};

export const authApi = {
  loginWithEmail: async (email: string, password: string, role: UserRole): Promise<AuthUser> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json() as Promise<AuthUser>;
  },

  loginWithIdentifier: async (identifier: string, password: string, role?: UserRole): Promise<AuthUser> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, ...(role ? { role } : {}) })
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json() as Promise<AuthUser>;
  }
};
