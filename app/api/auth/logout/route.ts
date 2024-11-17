import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  
  // Clear all auth-related cookies
  cookieStore.delete('gmail_access_token');
  cookieStore.delete('gmail_refresh_token');
  cookieStore.delete('user_info');
  
  return NextResponse.json({ success: true });
}