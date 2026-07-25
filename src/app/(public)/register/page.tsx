import { ArrowLeftIcon, WarehouseIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account — Distrible",
  description: "Set up your Distrible warehouse management account.",
};

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" weight="bold" />
          Back to home
        </Link>

        <div className="rounded-(--radius) border  shadow-card-foreground shadow-2xl bg-card p-8 sm:p-10">
          <div className="mb-8 flex flex-col ">
            
            <h1 className="text-2xl font-bold">
              Create your account
            </h1>
          </div>

          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-accent transition-colors hover:text-accent/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
