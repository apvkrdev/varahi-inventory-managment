import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');

  // Redirect to the actual login page with callback URL
  const loginUrl = new URL('/login', request.url);
  if (callbackUrl) {
    loginUrl.searchParams.set('callbackUrl', callbackUrl);
  }
  if (error) {
    loginUrl.searchParams.set('error', error);
  }

  return NextResponse.redirect(loginUrl);
}
