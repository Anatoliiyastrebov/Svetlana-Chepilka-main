import { NextRequest, NextResponse } from 'next/server';
import { setAuthData } from '../auth-store';

// This endpoint receives updates from the Telegram bot
// The bot should send user data when user clicks "Start" with an auth token

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Telegram sends updates in a specific format
    // We're looking for /start command with auth token
    const message = body.message;
    
    if (!message) {
      return NextResponse.json({ ok: true });
    }
    
    const text = message.text || '';
    const from = message.from;
    
    // Check if this is a /start command with auth token
    if (text.startsWith('/start ')) {
      const authToken = text.replace('/start ', '').trim();
      
      if (authToken && authToken.length > 10) {
        // Store user data with the auth token
        setAuthData(authToken, {
          id: from.id,
          first_name: from.first_name,
          last_name: from.last_name,
          username: from.username,
          auth_date: Math.floor(Date.now() / 1000),
        });
        
        console.log(`Auth successful for token: ${authToken.substring(0, 8)}...`);
      }
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ ok: true }); // Always return ok to Telegram
  }
}

// Allow GET for webhook verification
export async function GET() {
  return NextResponse.json({ status: 'Telegram webhook endpoint ready' });
}
