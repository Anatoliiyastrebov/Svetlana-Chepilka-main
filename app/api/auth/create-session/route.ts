import { NextResponse } from 'next/server';
import { createSession } from '../session-store';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const sessionId = createSession();
    
    return NextResponse.json({
      success: true,
      sessionId,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
