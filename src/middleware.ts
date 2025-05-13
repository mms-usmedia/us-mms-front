// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Rutas públicas (no requieren autenticación)
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Obtener token de autenticación de las cookies
  const isLoggedInCookie = request.cookies.has('isLoggedIn') && 
                          request.cookies.get('isLoggedIn')?.value === 'true';
  
  // Si el usuario no está autenticado y la ruta no es pública, redirigir al login
  if (!isLoggedInCookie && !isPublicRoute && pathname !== '/') {
    const loginUrl = new URL('/login', request.url);
    // Opcionalmente agregar un parámetro de redirección
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Si el usuario está autenticado y trata de acceder a una ruta pública
  // como login o registro, redirigir al dashboard
  if (isLoggedInCookie && (isPublicRoute || pathname === '/')) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  // En cualquier otro caso, continuar con la solicitud
  return NextResponse.next();
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  // Se aplicará a todas las rutas excepto a los archivos estáticos o API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
