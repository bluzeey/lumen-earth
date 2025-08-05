export const API_BASE = '/api';

export interface LoginResponse {
  token: string;
  [key: string]: unknown;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || 'Login failed';
    throw new Error(message);
  }

  const { token } = data as LoginResponse;
  if (!token) {
    throw new Error('Token not provided');
  }

  localStorage.setItem('token', token);
  return data as LoginResponse;
}

export function logout() {
  localStorage.removeItem('token');
}
