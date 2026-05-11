const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kinetix-backend.onrender.com/api/v1';

export const api = {
  async get(path: string, token?: string) {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
    });
    return res.json();
  },

  async post(path: string, body: unknown, token?: string) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },
};

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kinetix_token');
}

export function getRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kinetix_role');
}

export function setAuth(token: string, role: string, name?: string) {
  localStorage.setItem('kinetix_token', token);
  localStorage.setItem('kinetix_role', role);
  if (name) localStorage.setItem('kinetix_name', name);
}

export function getUserName(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kinetix_name');
}

export function clearAuth() {
  localStorage.removeItem('kinetix_token');
  localStorage.removeItem('kinetix_role');
  localStorage.removeItem('kinetix_name');
}
