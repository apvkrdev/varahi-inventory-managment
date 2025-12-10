import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const providers = authOptions.providers.map((provider: any) => ({
      id: provider.id,
      name: provider.name,
      type: provider.type,
      signinUrl: `/api/auth/signin/${provider.id}`,
      callbackUrl: '/api/auth/callback/' + provider.id,
    }));

    return NextResponse.json(providers);
  } catch (error) {
    console.error('Providers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}
