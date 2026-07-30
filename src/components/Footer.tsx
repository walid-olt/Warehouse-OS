import Image from "next/image";

function Footer() {
  return (
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
  );
}

export default Footer;
