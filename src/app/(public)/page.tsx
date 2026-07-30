import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import GridPattern from "@/components/GridPattern";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <GridPattern />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="hero-anim-2 text-5xl leading-[1.08] font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
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
              Get Started
              <ArrowRightIcon className="size-5" weight="bold" />
            </Button>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-linear-to-t from-background to-transparent" />
      </section>
    </div>
  );
}
