import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession, deleteSession } from '../session-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing token parameter' },
        { status: 400 }
      );
    }

    const user = getUserFromSession(token);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Session not found or expired' },
        { status: 404 }
      );
    }

    // Delete session after successful retrieval (one-time use token)
    deleteSession(token);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error getting user data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user data' },
      { status: 500 }
    );
  }
}
