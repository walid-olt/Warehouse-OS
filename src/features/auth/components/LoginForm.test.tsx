import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { vi, describe, it, expect, beforeEach } from "vitest";
import LoginForm from "./LoginForm";

// 1. Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// 2. Mock NextAuth
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

describe("LoginForm Component", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders email and password inputs and a submit button", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("displays a root error message when signIn returns an error", async () => {
    const user = userEvent.setup();

    // Mock failed login response
    (signIn as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      error: "CredentialsSignin",
      status: 401,
      ok: false,
      url: null,
    });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/work email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");

    // Submit
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Verify signIn call arguments
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "user@example.com",
      password: "password123",
      redirect: false,
    });

    // Check that root error message is rendered
    expect(
      await screen.findByText(/invalid email or password/i),
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("redirects to /dashboard on successful login", async () => {
    const user = userEvent.setup();

    // Mock successful login response
    (signIn as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      error: null,
      status: 200,
      ok: true,
      url: "/dashboard",
    });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/work email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});
