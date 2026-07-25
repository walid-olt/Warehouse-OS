"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof Link>;

export default function NavLink({ className, href, ...rest }: Props) {
  const path = usePathname();

  const hrefString = href.toString();

  const isActive = path === hrefString || path.startsWith(`${hrefString}/`);

  return (
    <Link
      {...rest}
      href={href}
      className={cn(className, isActive && "text-primary")}
    />
  );
}
