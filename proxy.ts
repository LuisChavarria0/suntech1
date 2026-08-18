import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(es|en)/:path*",
    "/((?!api|admin|cotizador|_next|_vercel|.*\\..*).*)",
  ],
};
