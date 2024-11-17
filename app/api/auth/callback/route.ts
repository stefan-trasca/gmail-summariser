import { NextResponse } from 'next/server';
import { getTokens, getUserInfo } from '@/lib/google-auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (error) {
      console.error('Auth error:', error);
      return NextResponse.redirect('/?error=auth_failed');
    }
    
    if (!code) {
      return NextResponse.redirect('/?error=no_code');
    }

    // Exchange code for tokens
    const tokens = await getTokens(code);
    
    if (!tokens.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info
    const userInfo = await getUserInfo(tokens.access_token);

    // Store tokens and user info in cookies
    const cookieStore = cookies();
    
    // Set access token
    cookieStore.set('gmail_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour
    });

    // Set refresh token if available
    if (tokens.refresh_token) {
      cookieStore.set('gmail_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });
    }

    // Set user info
    cookieStore.set('user_info', JSON.stringify({
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600
    });

    return NextResponse.redirect('/');
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect('/?error=auth_failed');
  }
}