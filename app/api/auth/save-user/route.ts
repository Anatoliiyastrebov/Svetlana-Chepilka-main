import { NextRequest, NextResponse } from 'next/server';
import { saveUserToSession } from '../session-store';
import type { TelegramWebAppUser } from '../../../../telegram-webapp';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, user } = body as { sessionId: string; user: TelegramWebAppUser };

    if (!sessionId || !user) {
      return NextResponse.json(
        { success: false, error: 'Missing sessionId or user data' },
        { status: 400 }
      );
    }

    if (!user.id || !user.first_name) {
      return NextResponse.json(
        { success: false, error: 'Invalid user data' },
        { status: 400 }
      );
    }

    const saved = saveUserToSession(sessionId, user);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Session not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save user' },
      { status: 500 }
    );
  }
}
