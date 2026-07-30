import { Check, Minus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "type" | "children"> {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function Checkbox({
  className,
  checked = false,
  indeterminate = false,
  onCheckedChange,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: custom checkbox using button for consistent styling
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      data-state={
        indeterminate ? "indeterminate" : checked ? "checked" : "unchecked"
      }
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "peer size-4 shrink-0 rounded-sm border border-input ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "flex items-center justify-center transition-colors",
        checked || indeterminate
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-transparent hover:border-foreground/30",
        className,
      )}
      {...props}
    >
      {indeterminate ? (
        <Minus className="size-3" weight="bold" />
      ) : checked ? (
        <Check className="size-3" weight="bold" />
      ) : null}
    </button>
  );
}

export { Checkbox };
