import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { ThemeSwitcher } from "./theme-switcher";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
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
