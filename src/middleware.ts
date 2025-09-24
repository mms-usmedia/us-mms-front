import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Aquí puedes agregar lógica adicional si es necesaria
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/campaigns/:path*",
    "/adops/:path*",
    "/finance/:path*",
    "/reports/:path*",
    "/organizations/:path*",
    "/hur/:path*",
    "/settings/:path*",
  ],
};
