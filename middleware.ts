import { NextResponse } from '@vercel/edge';
import type { NextRequest } from '@vercel/edge';
import { jwtVerify } from 'jose';

// Using your provided JWT secret
const JWT_SECRET = '123erwsdghyf';

export const config = {
  runtime: 'edge',
  matcher: '/api/:path*'
};

export default async function middleware(request: NextRequest) {
  // Skip auth check for login and register
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const encoder = new TextEncoder();
    const verified = await jwtVerify(token, encoder.encode(JWT_SECRET));
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', verified.payload.sub as string);
    
    const response = NextResponse.next();
    response.headers.set('x-user-id', verified.payload.sub as string);
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
}