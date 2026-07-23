import { ArrowLeftIcon, WarehouseIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Sign In — Distrible",
  description: "Sign in to your Distrible warehouse management account.",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b141a] px-4 py-12 text-white">
      <style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-anim { animation: card-in 0.6s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="card-anim relative z-10 w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
        >
          <ArrowLeftIcon className="size-4" weight="bold" />
          Back to home
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#111b21] p-8 shadow-2xl shadow-black/40 sm:p-10">
          {/* Logo + heading */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent/10">
              <WarehouseIcon className="size-6 text-accent" weight="fill" />
            </div>
            <h1 className="font-serif text-2xl font-bold">Welcome back</h1>
            <p className="mt-1.5 text-sm text-white/40">
              Sign in to your warehouse account.
            </p>
          </div>

          {/* Placeholder form — not wired to auth yet */}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-white/50"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="jane@warehouse.co"
                className="h-10 rounded-(--radius) border border-white/8 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-white/50"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
              />
            </div>

            <Button
              type="submit"
              className="mt-2 h-11 w-full bg-accent text-white font-semibold hover:bg-accent/90 shadow-[0_0_30px_rgba(37,211,102,0.2)]"
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-white/40">
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
