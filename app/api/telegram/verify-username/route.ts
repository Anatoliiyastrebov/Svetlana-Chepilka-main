import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW = 60_000;
const MAX_REQUESTS = 20;
const TIMEOUT_MS = 5_000;

const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestCounts) {
    if (now > entry.resetAt) requestCounts.delete(ip);
  }
}, 60_000);

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { exists: false, warning: true, message: 'Too many requests. Try again later.' },
        { status: 429 }
      );
    }

    const username = request.nextUrl.searchParams.get('username');
    if (!username || !/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
      return NextResponse.json(
        { exists: false, message: 'Invalid username format' },
        { status: 400 }
      );
    }

    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json(
        { exists: false, warning: true, message: 'Bot token not configured' },
        { status: 200 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${botToken}/getChat?chat_id=@${username}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      const data = await res.json();

      if (data.ok && data.result) {
        return NextResponse.json({ exists: true });
      }

      if (data.description?.includes('chat not found')) {
        return NextResponse.json({ exists: false, message: 'User not found' });
      }

      // Bot may not have access, but username could still exist
      return NextResponse.json({
        exists: false,
        warning: true,
        message: 'Could not verify — username may still be valid',
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        return NextResponse.json(
          { exists: false, warning: true, message: 'Verification timed out' },
          { status: 200 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error('Username verification error:', error);
    return NextResponse.json(
      { exists: false, warning: true, message: 'Verification service unavailable' },
      { status: 200 }
    );
  }
}
