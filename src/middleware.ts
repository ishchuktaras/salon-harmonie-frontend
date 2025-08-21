import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Adresářové cesty, které jsou chráněny a vyžadují přihlášení
const protectedPaths = [
    '/dashboard',
    '/calendar',
    '/clients',
    '/pos',
    '/settings',
    '/services'
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Zkontrolujeme, zda se uživatel snaží přistoupit na chráněnou cestu
  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

  // POKUD se snaží dostat na chráněnou stránku A ZÁROVEŇ nemá platný token,
  // přesměrujeme ho na přihlašovací stránku.
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Ve všech ostatních případech necháme požadavek projít.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Shoda se všemi cestami kromě těch, které jsou typicky pro statické soubory nebo API.
     * To zajišťuje, že middleware běží pouze pro stránky aplikace.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
