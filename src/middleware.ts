// /src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

// Rutas públicas (no requieren autenticación)
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Patrones de rutas estáticas (archivos)
const staticPatterns = [
  /^\/carousel\/.+/, // Imágenes del carrusel
  /^\/public\/.+/, // Otros archivos públicos
  /\.(jpg|jpeg|png|gif|svg|webp)$/i, // Todas las imágenes
  /\.(css|js)$/, // Archivos CSS y JS
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // SIEMPRE permitir acceso a imágenes y recursos estáticos
  if (
    pathname.includes("/carousel/") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".svg") ||
    pathname.includes("/_next/")
  ) {
    return NextResponse.next();
  }

  // Verificar si es una ruta estática (imágenes, archivos, etc)
  const isStaticFile = staticPatterns.some((pattern) => pattern.test(pathname));
  if (isStaticFile) {
    return NextResponse.next();
  }

  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Obtener token de autenticación de las cookies
  const isLoggedInCookie =
    request.cookies.has("isLoggedIn") &&
    request.cookies.get("isLoggedIn")?.value === "true";

  // Si el usuario no está autenticado y la ruta no es pública, redirigir al login
  if (!isLoggedInCookie && !isPublicRoute && pathname !== "/") {
    const loginUrl = new URL("/login", request.url);
    // Opcionalmente agregar un parámetro de redirección
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si el usuario está autenticado y trata de acceder a una ruta pública
  // como login o registro, redirigir al dashboard
  if (isLoggedInCookie && (isPublicRoute || pathname === "/")) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // En cualquier otro caso, continuar con la solicitud
  return NextResponse.next();
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  // Se aplicará a todas las rutas excepto a los archivos estáticos explícitamente excluidos
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|carousel).*)"],
};
