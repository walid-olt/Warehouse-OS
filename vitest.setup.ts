// extend Vitest with custom DOM matchers (like .toBeInTheDocument())
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Automatically clean up rendered elements after each test run
afterEach(() => {
  cleanup();
});
