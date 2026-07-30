// biome-ignore-all lint: reason
import {
  CheckIcon,
  PencilIcon,
  SpinnerIcon,
  XIcon,
} from "@phosphor-icons/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => Promise<unknown>;
  isLoading?: boolean;
  label?: string;
  placeholder?: string;
  type?: "text" | "textarea";
  className?: string;
  inputClassName?: string;
  validate?: (value: string) => string | null | undefined;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  isLoading = false,
  label,
  placeholder = "Click to edit...",
  type = "text",
  className,
  inputClassName,
  validate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync internal state when external data updates
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Auto-focus and select all text on edit mode activation
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if ("select" in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleStartEditing = () => {
    setError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmedValue = currentValue.trim();

    // Prevent saving unchanged values
    if (trimmedValue === value) {
      setIsEditing(false);
      return;
    }

    // Validation check
    if (validate) {
      const validationError = validate(trimmedValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    try {
      await onSave(trimmedValue);
      setIsEditing(false);
      setError(null);
    } catch {
      // Keep edit mode open on error so user doesn't lose input
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && type === "text") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Enter" && e.ctrlKey && type === "textarea") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
      )}

      {isEditing ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            {type === "textarea" ? (
              <Textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={placeholder}
                className={cn("min-h-20", inputClassName)}
              />
            ) : (
              <Input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={placeholder}
                className={inputClassName}
              />
            )}

            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <SpinnerIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                <span className="sr-only">Save</span>
              </Button>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </Button>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      ) : (
        <div
          onClick={handleStartEditing}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleStartEditing()}
          className="group flex cursor-pointer items-center justify-between rounded-md border border-transparent px-2.5 py-1.5 transition-colors hover:border-border hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span
            className={cn("text-sm", !value && "text-muted-foreground italic")}
          >
            {value || placeholder}
          </span>
          <PencilIcon className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      )}
    </div>
  );
};
