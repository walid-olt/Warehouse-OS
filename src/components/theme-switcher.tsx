"use client";

import { Moon, Sun } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function ThemeSwitcher() {
  const { theme, toggle } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="text-foreground/60 hover:text-foreground"
    >
      {theme === "dark" ? (
        <Sun className="size-4" weight="fill" />
      ) : (
        <Moon className="size-4" weight="fill" />
      )}
    </Button>
  );
}
