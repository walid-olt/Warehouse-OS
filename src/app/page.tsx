import { ArrowRightIcon, Warehouse } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/distrible.svg"
            alt="Distrible"
            width={120}
            height={38}
            priority
            className="dark:invert"
          />
        </Link>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button
            nativeButton={false}
            render={<Link href="/register" />}
            variant="default"
            size="sm"
          >
            Start for Free
            <ArrowRightIcon className="size-4" weight="bold" />
          </Button>
        </div>
      </nav>
    </header>
  );
}

function GridPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />

      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="hero-anim-2 font-serif text-5xl leading-[1.08] font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Your warehouse,{" "}
            <span className="bg-linear-to-r from-accent to-primary bg-clip-text text-transparent">
              fully under control
            </span>
          </h1>

          <p className="hero-anim-3 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Track inventory, manage orders, and monitor performance — all from a
            single, intuitive dashboard built for modern warehouse operations.
          </p>

          <div className="hero-anim-4 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              nativeButton={false}
              render={<Link href="/register" />}
              variant="default"
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-base font-semibold shadow-[0_0_40px_theme(--accent/0.25)]"
            >
              Get Started — It's Free
              <ArrowRightIcon className="size-5" weight="bold" />
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="#features" />}
              variant="ghost"
              size="lg"
              className="text-muted-foreground hover:text-foreground text-base"
            >
              See how it works
            </Button>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <Image
            src="/distrible.svg"
            alt="Distrible"
            width={100}
            height={32}
            className="opacity-40 grayscale dark:invert"
          />
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Distrible. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
