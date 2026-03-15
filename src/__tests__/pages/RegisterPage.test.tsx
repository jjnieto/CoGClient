import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../../pages/RegisterPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockSetAuth = vi.fn();
vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn((selector: (s: Record<string, unknown>) => unknown) =>
    selector({ setAuth: mockSetAuth }),
  ),
}));

vi.mock('../../services/auth', () => ({
  register: vi.fn(),
}));

import { register } from '../../services/auth';

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders username, email, password fields and register button', () => {
    renderPage();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('renders link to login page', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
  });

  it('submits registration and navigates to dashboard on success', async () => {
    const user = userEvent.setup();
    vi.mocked(register).mockResolvedValueOnce({
      token: '1|abc',
      user: { id: 1, username: 'hero1', cogBalance: 0 },
    });

    renderPage();

    await user.type(screen.getByLabelText(/username/i), 'hero1');
    await user.type(screen.getByLabelText(/email/i), 'hero1@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        username: 'hero1',
        email: 'hero1@test.com',
        password: 'password123',
      });
      expect(mockSetAuth).toHaveBeenCalledWith('1|abc', {
        id: 1,
        username: 'hero1',
        cogBalance: 0,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message on registration failure', async () => {
    const user = userEvent.setup();
    const { ApiError } = await import('../../services/client');
    vi.mocked(register).mockRejectedValueOnce(new ApiError(409, 'Username already taken'));

    renderPage();

    await user.type(screen.getByLabelText(/username/i), 'taken');
    await user.type(screen.getByLabelText(/email/i), 'taken@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Username already taken')).toBeInTheDocument();
    });
  });
});
