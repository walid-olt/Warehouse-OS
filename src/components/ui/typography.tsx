import type React from "react";
import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

interface HeadingProps extends React.ComponentPropsWithoutRef<"h1"> {
  as?: HeadingLevel;
}

const headingStyles: Record<HeadingLevel, string> = {
  h1: "scroll-m-20 text-3xl font-bold tracking-tight text-foreground",
  h2: "scroll-m-18 text-2xl font-semibold tracking-tight text-foreground",
  h3: "scroll-m-16 text-xl font-semibold tracking-tight text-foreground",
  h4: "scroll-m-12 text-lg font-medium text-foreground",
};

function Heading({ className, as: Tag = "h1", ...props }: HeadingProps) {
  return (
    <Tag
      data-slot="heading"
      className={cn(headingStyles[Tag], className)}
      {...props}
    />
  );
}

interface SubheadingProps extends React.ComponentPropsWithoutRef<"p"> {
  as?: "p" | "span";
}

function Subheading({ className, as: Tag = "p", ...props }: SubheadingProps) {
  return (
    <Tag
      data-slot="subheading"
      className={cn(
        "text-base text-muted-foreground/90 leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

function Lead({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      data-slot="lead"
      className={cn("text-lg text-muted-foreground", className)}
      {...props}
    />
  );
}

function Large({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="large"
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function Small({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"small">) {
  return (
    <small
      data-slot="small"
      className={cn("text-sm font-medium text-foreground/80", className)}
      {...props}
    />
  );
}

function Muted({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      data-slot="muted"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function Code({ className, ...props }: React.ComponentPropsWithoutRef<"code">) {
  return (
    <code
      data-slot="code"
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function InlineCode({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"code">) {
  return (
    <code
      data-slot="inline-code"
      className={cn(
        "rounded bg-muted px-1 py-0.5 font-mono text-sm text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Heading, Subheading, Lead, Large, Small, Muted, Code, InlineCode };
