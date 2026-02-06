import type { TelegramWebAppUser } from '../../../telegram-webapp';

interface SessionData {
  user?: TelegramWebAppUser;
  createdAt: number;
}

// In-memory store for sessions
// In production, use Redis or a database
const sessionStore = new Map<string, SessionData>();

// Session expiry: 10 minutes
const SESSION_EXPIRY = 10 * 60 * 1000;

// Clean up expired sessions periodically
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, data] of sessionStore.entries()) {
    if (now - data.createdAt > SESSION_EXPIRY) {
      sessionStore.delete(sessionId);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredSessions, 5 * 60 * 1000);
}

export function createSession(): string {
  cleanupExpiredSessions();
  const sessionId = crypto.randomUUID();
  sessionStore.set(sessionId, {
    createdAt: Date.now(),
  });
  return sessionId;
}

export function saveUserToSession(sessionId: string, user: TelegramWebAppUser): boolean {
  const session = sessionStore.get(sessionId);
  if (!session) {
    return false;
  }
  session.user = user;
  return true;
}

export function getUserFromSession(sessionId: string): TelegramWebAppUser | null {
  const session = sessionStore.get(sessionId);
  if (!session || !session.user) {
    return null;
  }
  return session.user;
}

export function deleteSession(sessionId: string): void {
  sessionStore.delete(sessionId);
}
