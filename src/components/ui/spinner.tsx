import { SpinnerIcon } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-5",
      lg: "size-8",
      xl: "size-12",
    },
    variant: {
      default: "text-muted-foreground",
      primary: "text-primary",
      accent: "text-accent",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

interface SpinnerProps
  extends React.ComponentPropsWithoutRef<"svg">,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

function Spinner({ className, size, variant, label, ...props }: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2" role="status">
      <SpinnerIcon
        data-slot="spinner"
        className={cn(spinnerVariants({ size, variant, className }))}
        {...props}
      />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </span>
  );
}

interface PageLoaderProps {
  className?: string;
  label?: string;
}

function PageLoader({ className, label = "Loading..." }: PageLoaderProps) {
  return (
    <div
      data-slot="page-loader"
      className={cn(
        "flex min-h-[200px] w-full flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <Spinner size="xl" variant="primary" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}

interface LoadingOverlayProps {
  className?: string;
  label?: string;
}

function LoadingOverlay({ className, label }: LoadingOverlayProps) {
  return (
    <div
      data-slot="loading-overlay"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-xs",
        className,
      )}
    >
      <Spinner size="xl" variant="primary" label={label} />
    </div>
  );
}

export { Spinner, PageLoader, LoadingOverlay };
