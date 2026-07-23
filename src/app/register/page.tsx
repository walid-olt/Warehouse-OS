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
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b141a] px-4 py-12 text-white">
      <style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-anim { animation: card-in 0.6s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="card-anim relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
        >
          <ArrowLeftIcon className="size-4" weight="bold" />
          Back to home
        </Link>

        <div className="rounded-2xl border border-white/[0.06] bg-[#111b21] p-8 shadow-2xl shadow-black/40 sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent/10">
              <WarehouseIcon className="size-6 text-accent" weight="fill" />
            </div>
            <h1 className="font-serif text-2xl font-bold">
              Create your account
            </h1>
          </div>

          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-white/40">
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
