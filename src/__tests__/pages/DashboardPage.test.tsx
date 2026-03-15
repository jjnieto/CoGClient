import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../../pages/DashboardPage';

const mockSetUser = vi.fn();
vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn((selector: (s: Record<string, unknown>) => unknown) =>
    selector({ token: 'test-token', user: { id: 1, username: 'hero1', cogBalance: 500 }, setUser: mockSetUser }),
  ),
}));

vi.mock('../../services/auth', () => ({
  getMe: vi.fn(),
}));

vi.mock('../../services/faucet', () => ({
  withdraw: vi.fn(),
}));

import { getMe } from '../../services/auth';
import { withdraw } from '../../services/faucet';

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getMe).mockResolvedValue({ id: 1, username: 'hero1', cogBalance: 500 });
  });

  it('renders user info and faucet section after loading', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('hero1')).toBeInTheDocument();
    });

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Dev Faucet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get free cog/i })).toBeInTheDocument();
  });

  it('shows success message after faucet withdraw', async () => {
    const user = userEvent.setup();
    vi.mocked(withdraw).mockResolvedValueOnce({
      amount: 500,
      totalWithdrawn: 500,
      newBalance: 1000,
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /get free cog/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /get free cog/i }));

    await waitFor(() => {
      expect(withdraw).toHaveBeenCalledWith('test-token');
      expect(screen.getByText(/\+500 COG received/)).toBeInTheDocument();
      expect(screen.getByText(/Total withdrawn: 500\/2500/)).toBeInTheDocument();
    });
  });

  it('shows error when max withdrawal reached', async () => {
    const user = userEvent.setup();
    const { ApiError } = await import('../../services/client');
    vi.mocked(withdraw).mockRejectedValueOnce(new ApiError(400, 'Max withdrawal reached'));

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /get free cog/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /get free cog/i }));

    await waitFor(() => {
      expect(screen.getByText('Max withdrawal reached')).toBeInTheDocument();
    });
  });
});
