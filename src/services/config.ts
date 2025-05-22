// src/services/config.ts

/**
 * Base URL for all API requests.
 * In production (Vercel), this must be set in the environment:
 * VITE_API_BASE_URL=https://kolik.onrender.com/api
 */
if (!import.meta.env.VITE_API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL in environment.");
}

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * Universal error handler for fetch responses.
 * Throws so callers can catch and display a user‐friendly message.
 */
export function handleError(res: Response): void {
  throw new Error(`Request failed with status ${res.status}`);
}

/**
 * Read a cookie value by name (returns null if not present).
 */
export function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Hit Django’s CSRF endpoint to set the `csrftoken` cookie,
 * then return its value for use in X-CSRFToken headers.
 */
export async function fetchCsrfToken(): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/csrf/`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) throw new Error('Could not fetch CSRF token');

  // ✅ wait a microtask to let the browser set the cookie
  await new Promise(resolve => setTimeout(resolve, 100));

  const token = getCookie('csrftoken');
  if (!token) throw new Error('CSRF cookie not found');
  return token;
}