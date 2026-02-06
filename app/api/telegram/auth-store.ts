// Simple in-memory store for auth tokens
// In production, use Redis or a database

interface AuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
}

// Map of auth tokens to user data
const authStore = new Map<string, AuthData>();

// Token expiry time (10 minutes)
const TOKEN_EXPIRY = 10 * 60 * 1000;

// Clean up expired tokens periodically
const tokenTimestamps = new Map<string, number>();

export function generateAuthToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  tokenTimestamps.set(token, Date.now());
  return token;
}

export function setAuthData(token: string, data: AuthData): void {
  authStore.set(token, data);
  tokenTimestamps.set(token, Date.now());
}

export function getAuthData(token: string): AuthData | null {
  const timestamp = tokenTimestamps.get(token);
  if (!timestamp || Date.now() - timestamp > TOKEN_EXPIRY) {
    // Token expired or doesn't exist
    authStore.delete(token);
    tokenTimestamps.delete(token);
    return null;
  }
  return authStore.get(token) || null;
}

export function deleteAuthData(token: string): void {
  authStore.delete(token);
  tokenTimestamps.delete(token);
}

// Clean up expired tokens every minute
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [token, timestamp] of tokenTimestamps.entries()) {
      if (now - timestamp > TOKEN_EXPIRY) {
        authStore.delete(token);
        tokenTimestamps.delete(token);
      }
    }
  }, 60 * 1000);
}
