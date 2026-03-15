import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import InventoryPage from '../../pages/InventoryPage';

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn((selector: (s: Record<string, unknown>) => unknown) =>
    selector({ token: 'test-token' }),
  ),
}));

vi.mock('../../services/items', () => ({
  getInventory: vi.fn(),
}));

vi.mock('../../hooks/useGameData', () => ({
  usePotions: vi.fn(() => ({
    data: [
      { id: 1, name: 'Basic health potion', description: 'Heals HP', statToBoost: [0], boost: [5000] },
      { id: 5, name: 'Vitality Potion', description: 'Restores vitality', statToBoost: [8], boost: [25000] },
    ],
  })),
  useMaterials: vi.fn(() => ({
    data: [
      { id: 5, name: 'Copper', description: 'Unrefined copper', ownValue: 0 },
      { id: 20, name: 'Coal', description: 'Forge fuel', ownValue: 0 },
    ],
  })),
  useRecipes: vi.fn(() => ({
    data: [
      { id: 1, name: 'Bronze Recipe', description: 'Meld copper and zinc' },
    ],
  })),
}));

import { getInventory } from '../../services/items';

const mockInventory = {
  potions: [
    { index: 1, quantity: 3, tokenId: 1 },
    { index: 5, quantity: 1, tokenId: 5 },
  ],
  materials: [
    { index: 5, quantity: 10, tokenId: 10005 },
    { index: 20, quantity: 4, tokenId: 10020 },
  ],
  recipes: [
    { index: 1, quantity: 1, tokenId: 20001 },
  ],
};

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('InventoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getInventory).mockResolvedValue(mockInventory);
  });

  it('renders potions tab by default with item names and quantities', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Basic health potion')).toBeInTheDocument();
    });
    expect(screen.getByText('Vitality Potion')).toBeInTheDocument();
    expect(screen.getByText('x3')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();
  });

  it('shows tab counts', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Potions (2)')).toBeInTheDocument();
    });
    expect(screen.getByText('Materials (2)')).toBeInTheDocument();
    expect(screen.getByText('Recipes (1)')).toBeInTheDocument();
  });

  it('switches to materials tab', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Materials (2)')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Materials (2)'));
    expect(screen.getByText('Copper')).toBeInTheDocument();
    expect(screen.getByText('Coal')).toBeInTheDocument();
  });

  it('switches to recipes tab', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Recipes (1)')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Recipes (1)'));
    expect(screen.getByText('Bronze Recipe')).toBeInTheDocument();
  });

  it('shows info text about potion usage', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Combat potions are used when playing quests/)).toBeInTheDocument();
    });
  });

  it('shows empty state for empty inventory', async () => {
    vi.mocked(getInventory).mockResolvedValue({ potions: [], materials: [], recipes: [] });
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('No potions.')).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    vi.mocked(getInventory).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
