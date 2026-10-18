import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { withPath } from "@/lib/withPath";
import { isAdmin } from "./src/shared/auth/isAdmin";
import type { AppJWT } from "./src/shared/auth/jwt";
import { Permission } from "./src/modules/auth/domain/Permission";
import { PROTECTED_ROUTES } from "./src/config/protectedRoutes";

const DEMO_PUBLIC_API_PATHS = new Set([
  "/api/memberships/public",
  "/api/projects/basic",
  "/api/projects/home/company",
  "/api/projects/home/realEstate",
  "/api/projects/metadata",
  "/api/realEstate",
]);

function isDemoPublicApi(pathname: string, method: string) {
  if (method !== "GET") return false;
  return (
    DEMO_PUBLIC_API_PATHS.has(pathname) ||
    /^\/api\/projects\/[^/]+$/.test(pathname)
  );
}

function demoResponse(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/")) {
    return isDemoPublicApi(pathname, req.method)
      ? NextResponse.next()
      : NextResponse.json(
          { error: "Esta operación no está disponible en la demo pública." },
          { status: 404 }
        );
  }

  return withPath(NextResponse.redirect(new URL("/", req.url)), pathname);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (process.env.DEMO_MODE === "true") {
    if (
      pathname.startsWith("/api/") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/usuario") ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/login")
    ) {
      return demoResponse(req);
    }
  }

  if (pathname.startsWith("/login")) {
    const redirectUrl = req.nextUrl.clone();
    let targetPath = pathname.replace(/^\/login/, "/auth");

    if (targetPath === "/auth") {
      targetPath = "/auth/login";
    }

    if (targetPath.startsWith("/auth/forget-password")) {
      targetPath = "/auth/forgot-password";
    }

    redirectUrl.pathname = targetPath;
    return withPath(NextResponse.redirect(redirectUrl), pathname);
  }

  const matchedRoute = Object.keys(PROTECTED_ROUTES)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname.startsWith(route));

  if (!matchedRoute) {
    return NextResponse.next();
  }

  const routeConfig = PROTECTED_ROUTES[matchedRoute];

  const hasSessionCookie = Boolean(
    req.cookies.get("__Secure-next-auth.session-token")?.value ??
      req.cookies.get("__Host-next-auth.session-token")?.value ??
      req.cookies.get("next-auth.session-token")?.value
  );

  if (!hasSessionCookie) {
    if (pathname.startsWith("/auth")) {
      return withPath(NextResponse.next(), pathname);
    }

    return withPath(
      NextResponse.redirect(new URL("/auth/login", req.url)),
      pathname
    );
  }

  const token = (await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })) as AppJWT | null;

  const membershipId = Number(token?.membershipId);

  const userPermissions = (token?.permissions ?? []).map(
    (p) => p.name as Permission
  );

  const userIsAdmin = isAdmin(userPermissions);

  /**
   * NO autenticado
   */
  if (!token && !pathname.startsWith("/auth")) {
    return withPath(
      NextResponse.redirect(new URL("/auth/login", req.url)),
      pathname
    );
  }

  /**
   * Usuario logueado intentando ir a login
   */
  if (pathname.startsWith("/auth") && token) {
    return withPath(
      NextResponse.redirect(new URL(userIsAdmin ? "/admin" : "/", req.url)),
      pathname
    );
  }

  /**
   * Subir propiedad requiere membresía
   */
  if (pathname === "/usuario/subir-propiedad" && token && !membershipId) {
    return withPath(
      NextResponse.redirect(new URL("/membresias", req.url)),
      pathname
    );
  }

  /**
   * Ruta sin permisos específicos
   */
  if (!routeConfig.permissions) {
    return withPath(NextResponse.next(), pathname);
  }

  /**
   * Sin permisos
   */
  if (!userPermissions.length) {
    return withPath(
      NextResponse.redirect(new URL("/unauthorized", req.url)),
      pathname
    );
  }

  const hasPermission = routeConfig.permissions.some((perm) =>
    userPermissions.includes(perm)
  );

  if (!hasPermission) {
    return withPath(
      NextResponse.redirect(new URL("/unauthorized", req.url)),
      pathname
    );
  }

  return withPath(NextResponse.next(), pathname);
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/usuario/:path*",
    "/auth/:path*",
    "/login/:path*",
  ],
};
