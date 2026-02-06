import { NextResponse } from 'next/server';
import { generateAuthToken } from '../auth-store';

// Generate a new auth token for the frontend
export async function GET() {
  const token = generateAuthToken();
  return NextResponse.json({ token });
}
