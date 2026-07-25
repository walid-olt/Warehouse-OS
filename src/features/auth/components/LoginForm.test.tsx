import { describe, it,  expect, vi } from "vitest";
import { render, screen } from '@testing-library/react'
import LoginForm from './LoginForm'

vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }
  },
  usePathname() {
    return '/'
  },
}))
describe('LoginForm', () => {
  it('renders the login form', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })
  })
