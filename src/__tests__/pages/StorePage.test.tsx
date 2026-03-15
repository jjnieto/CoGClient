import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import StorePage from '../../pages/StorePage';

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn((selector: (s: Record<string, unknown>) => unknown) =>
    selector({ token: 'test-token' }),
  ),
}));

vi.mock('../../services/store', () => ({
  getCatalog: vi.fn(),
  purchase: vi.fn(),
}));

import { getCatalog, purchase } from '../../services/store';

const mockCatalog = {
  characters: [
    { itemIndex: 0, price: 200, name: 'Barbarian' },
    { itemIndex: 1, price: 200, name: 'Rogue' },
  ],
  equipment: [
    { itemIndex: 1, price: 80, name: 'Leather helm' },
  ],
  potions: [
    { itemIndex: 1, price: 50, name: 'Basic health potion' },
  ],
  materials: [
    { itemIndex: 5, price: 30, name: 'Copper' },
  ],
  recipes: [
    { itemIndex: 1, price: 100, name: 'Bronze Recipe' },
  ],
  cog: [],
};

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <StorePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('StorePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCatalog).mockResolvedValue(mockCatalog);
  });

  it('renders catalog grouped by category', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Barbarian')).toBeInTheDocument();
    });

    expect(screen.getByText('Characters')).toBeInTheDocument();
    expect(screen.getByText('Equipment')).toBeInTheDocument();
    expect(screen.getByText('Potions')).toBeInTheDocument();
    expect(screen.getByText('Materials')).toBeInTheDocument();
    expect(screen.getByText('Recipes')).toBeInTheDocument();

    expect(screen.getByText('Rogue')).toBeInTheDocument();
    expect(screen.getByText('Leather helm')).toBeInTheDocument();
    expect(screen.getByText('Basic health potion')).toBeInTheDocument();
    expect(screen.getByText('Copper')).toBeInTheDocument();
    expect(screen.getByText('Bronze Recipe')).toBeInTheDocument();
  });

  it('shows prices for items', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Barbarian')).toBeInTheDocument();
    });

    expect(screen.getAllByText('200 COG').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('80 COG')).toBeInTheDocument();
    expect(screen.getByText('50 COG')).toBeInTheDocument();
  });

  it('shows character name input for character purchases', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Barbarian')).toBeInTheDocument();
    });

    expect(screen.getAllByPlaceholderText('Character name').length).toBeGreaterThanOrEqual(1);
  });

  it('purchases a character and shows success message', async () => {
    const user = userEvent.setup();
    vi.mocked(purchase).mockResolvedValueOnce({
      purchased: { class: 0, index: 0, amount: 1 },
      cogSpent: 200,
      newBalance: 2300,
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Barbarian')).toBeInTheDocument();
    });

    const nameInputs = screen.getAllByPlaceholderText('Character name');
    await user.type(nameInputs[0]!, 'Ragnar');

    const buyButtons = screen.getAllByRole('button', { name: /buy/i });
    await user.click(buyButtons[0]!);

    await waitFor(() => {
      expect(purchase).toHaveBeenCalledWith('test-token', {
        class: 0,
        storeIndex: 0,
        amount: 1,
        characterName: 'Ragnar',
      });
      expect(screen.getByText(/Spent 200 COG/)).toBeInTheDocument();
    });
  });

  it('shows error when purchasing without character name', async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Barbarian')).toBeInTheDocument();
    });

    const buyButtons = screen.getAllByRole('button', { name: /buy/i });
    await user.click(buyButtons[0]!);

    await waitFor(() => {
      expect(screen.getByText('Please enter a character name')).toBeInTheDocument();
    });
    expect(purchase).not.toHaveBeenCalled();
  });

  it('shows error on insufficient COG', async () => {
    const user = userEvent.setup();
    const { ApiError } = await import('../../services/client');
    vi.mocked(purchase).mockRejectedValueOnce(new ApiError(402, 'Insufficient COG'));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Leather helm')).toBeInTheDocument();
    });

    // Click buy on the equipment item (3rd buy button: after 2 characters)
    const buyButtons = screen.getAllByRole('button', { name: /buy/i });
    await user.click(buyButtons[2]!);

    await waitFor(() => {
      expect(screen.getByText('Insufficient COG')).toBeInTheDocument();
    });
  });

  it('renders loading state', () => {
    vi.mocked(getCatalog).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
