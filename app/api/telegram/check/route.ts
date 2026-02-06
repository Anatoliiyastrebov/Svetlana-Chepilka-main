import { NextRequest, NextResponse } from 'next/server';
import { getAuthData, deleteAuthData } from '../auth-store';

// Frontend calls this to check if user has authorized
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (!token) {
    return NextResponse.json({ authorized: false, error: 'No token provided' });
  }
  
  const userData = getAuthData(token);
  
  if (userData) {
    // Delete token after successful retrieval (one-time use)
    deleteAuthData(token);
    
    return NextResponse.json({
      authorized: true,
      user: userData,
    });
  }
  
  return NextResponse.json({ authorized: false });
}
