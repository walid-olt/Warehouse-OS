import { ArrowLeftIcon, } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/features/auth/components/LoginForm";
import GridPattern from "@/components/GridPattern";

export const metadata: Metadata = {
  title: "Sign In — Distrible",
  description: "Sign in to your Distrible warehouse management account.",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-20">
      
<GridPattern/>
           <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" weight="bold" />
          Back to home
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            
            <h1 className="font-serif text-2xl font-bold">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to your warehouse account.
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-accent transition-colors hover:text-accent/80"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
