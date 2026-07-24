import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

const publicPages = ["/", "/login", "/register"];

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isPublic = publicPages.includes(pathname);

  if (!isLoggedIn && !isPublic) {
    return Response.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && isPublic) {
    return Response.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
