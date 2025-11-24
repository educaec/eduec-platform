export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",   // protege cualquier ruta dentro de dashboard
  ],
};
