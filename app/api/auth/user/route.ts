import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const userInfoCookie = cookieStore.get('user_info');
  
  if (!userInfoCookie?.value) {
    return NextResponse.json({ user: null });
  }

  try {
    const userInfo = JSON.parse(userInfoCookie.value);
    return NextResponse.json({ user: userInfo });
  } catch (error) {
    console.error('Error parsing user info:', error);
    return NextResponse.json({ user: null });
  }
}