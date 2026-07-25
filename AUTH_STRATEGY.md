# Auth Strategy

## Current Setup

- **NextAuth v5** (beta.31) with JWT session strategy
- **Credentials provider** (email/password via bcryptjs)
- **MongoDB/Mongoose** for user storage
- `src/auth.ts` exports `auth`, `handlers`, `signIn`, `signOut`
- `src/auth.config.ts` holds base NextAuth config

## What's Missing

- No `proxy.ts` — every page is unprotected
- No `SessionProvider` — client components can't access session
- No `auth()` calls in server components — no way to check who's logged in
- Dashboard is fully public

---

## 1. Add SessionProvider to Root Layout

Wrap children in `SessionProvider` so `useSession()` works in client components.

```tsx
// src/app/layout.tsx
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="...">
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## 2. Proxy for Route Protection

Already set up at `src/proxy.ts`. Uses Next.js 16's `proxy` convention (replaces `middleware.ts`).

```ts
// src/proxy.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

const publicPages = ["/", "/login", "/register"];

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isPublic = publicPages.includes(pathname);

  // Redirect unauthenticated users to login
  if (!isLoggedIn && !isPublic) {
    return Response.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users away from public pages
  if (isLoggedIn && isPublic) {
    return Response.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

- Runs on Node.js at origin (not Edge)
- Protects all routes except `/`, `/login`, `/register`, and static assets
- Add new public pages to the `publicPages` array

## 3. Access Auth in Server Components

Use the `auth()` wrapper from `src/auth.ts` directly in server components. No context needed — it returns the session object.

```tsx
// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      <p>User ID: {session.user?.id}</p>
    </div>
  );
}
```

### Fetching full user data from MongoDB

The session only contains `id`, `name`, `email`. To get the full user document:

```tsx
import { auth } from "@/auth";
import { getUserById } from "@/features/auth/lib";
import { connectDB } from "@/lib/mongodb";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  await connectDB();
  const user = await getUserById(session.user.id);

  return <div>Welcome, {user?.name}</div>;
}
```

## 4. Access Auth in Client Components

Two ways:

### Option A: `useSession()` hook (preferred)

```tsx
"use client";
import { useSession } from "next-auth/react";

export default function ProfileCard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Spinner />;
  if (!session) return null;

  return <div>Hello, {session.user.name}</div>;
}
```

### Option B: `getServerSession()` in a Server Component passed as props

```tsx
// Server component
import { auth } from "@/auth";
import ClientComponent from "./ClientComponent";

export default async function Page() {
  const session = await auth();
  return <ClientComponent user={session?.user} />;
}
```

## 5. Sign Out

```tsx
"use client";
import { signOut } from "next-auth/react";

<button onClick={() => signOut({ callbackUrl: "/login" })}>
  Sign Out
</button>
```

## 6. Route Groups (Optional but Recommended)

Organize routes by auth requirement:

```
src/app/
  (public)/
    login/page.tsx
    register/page.tsx
    page.tsx          # landing
  (protected)/
    dashboard/page.tsx
    inventory/page.tsx
    orders/page.tsx
  layout.tsx          # root layout with SessionProvider
```

Proxy handles the enforcement. Route groups are purely organizational.

## 7. Role-Based Access (Future)

If you add roles to the User model later:

```ts
// In proxy.ts
const isAdmin = req.auth?.user?.role === "admin";
if (pathname.startsWith("/admin") && !isAdmin) {
  return Response.redirect(new URL("/dashboard", req.nextUrl));
}
```

---

## Checklist

- [ ] Add `SessionProvider` to `src/app/layout.tsx`
- [ ] Create `src/proxy.ts` with route protection
- [ ] Update server pages to call `auth()` and handle redirects
- [ ] Update client components to use `useSession()`
- [ ] Remove `console.log` statements from `src/auth.ts` callbacks
- [ ] Add `NEXTAUTH_SECRET` env var (required for JWT)
- [ ] Add `NEXTAUTH_URL` env var (e.g., `http://localhost:3000`)
