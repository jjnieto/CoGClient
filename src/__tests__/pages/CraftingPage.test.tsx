import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import CraftingPage from '../../pages/CraftingPage';

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn((selector: (s: Record<string, unknown>) => unknown) =>
    selector({ token: 'test-token' }),
  ),
}));

vi.mock('../../services/items', () => ({
  getInventory: vi.fn(),
}));

vi.mock('../../services/crafting', () => ({
  craft: vi.fn(),
}));

vi.mock('../../hooks/useGameData', () => ({
  useRecipes: vi.fn(() => ({
    data: [
      { id: 0, name: 'None', description: 'None', classToBurn: [0], itemToBurn: [0], amountToBurn: [0], classToMint: [0], itemToMint: [0], amountToMint: [0] },
      { id: 1, name: 'Bronze Recipe', description: 'Meld copper and zinc', classToBurn: [3, 3, 3], itemToBurn: [5, 9, 20], amountToBurn: [1, 3, 1], classToMint: [3], itemToMint: [11], amountToMint: [1] },
      { id: 8, name: 'Wool hank recipe', description: 'Commonly used', classToBurn: [3], itemToBurn: [16], amountToBurn: [3], classToMint: [3], itemToMint: [22], amountToMint: [1] },
    ],
    isLoading: false,
  })),
  useMaterials: vi.fn(() => ({
    data: [
      { id: 5, name: 'Copper' },
      { id: 9, name: 'Zinc' },
      { id: 11, name: 'Bronze' },
      { id: 16, name: 'Wool' },
      { id: 20, name: 'Coal' },
      { id: 22, name: 'Wool hank' },
    ],
  })),
  usePotions: vi.fn(() => ({ data: [] })),
}));

import { getInventory } from '../../services/items';
import { craft } from '../../services/crafting';

const mockInventoryWithRecipe = {
  potions: [],
  materials: [
    { index: 5, quantity: 5, tokenId: 10005 },  // Copper
    { index: 9, quantity: 10, tokenId: 10009 },  // Zinc
    { index: 20, quantity: 3, tokenId: 10020 },  // Coal
  ],
  recipes: [
    { index: 1, quantity: 1, tokenId: 20001 },  // Bronze Recipe
  ],
};

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <CraftingPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('CraftingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getInventory).mockResolvedValue(mockInventoryWithRecipe);
  });

  it('renders owned recipes with ingredient details', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Bronze Recipe')).toBeInTheDocument();
    });
    expect(screen.getByText(/1x Copper/)).toBeInTheDocument();
    expect(screen.getByText(/3x Zinc/)).toBeInTheDocument();
    expect(screen.getByText(/1x Coal/)).toBeInTheDocument();
  });

  it('shows owned quantities for ingredients', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/have 5/)).toBeInTheDocument(); // Copper
    });
    expect(screen.getByText(/have 10/)).toBeInTheDocument(); // Zinc
  });

  it('shows output item', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/1x Bronze/)).toBeInTheDocument();
    });
  });

  it('enables craft button when all materials available', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /craft/i })).toBeEnabled();
    });
  });

  it('disables craft button when materials insufficient', async () => {
    vi.mocked(getInventory).mockResolvedValue({
      ...mockInventoryWithRecipe,
      materials: [{ index: 5, quantity: 1, tokenId: 10005 }], // Only Copper, no Zinc/Coal
    });
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /missing materials/i })).toBeDisabled();
    });
  });

  it('crafts and shows result', async () => {
    const user = userEvent.setup();
    vi.mocked(craft).mockResolvedValueOnce({
      burned: [
        { class: 3, index: 5, amount: 1 },
        { class: 3, index: 9, amount: 3 },
        { class: 3, index: 20, amount: 1 },
      ],
      created: [{ class: 3, index: 11, amount: 1 }],
    });

    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /craft/i })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: /craft/i }));

    await waitFor(() => {
      expect(screen.getByText('Crafted!')).toBeInTheDocument();
      expect(screen.getByText(/-1x Copper/)).toBeInTheDocument();
      expect(screen.getByText(/\+1x Bronze/)).toBeInTheDocument();
    });
  });

  it('shows empty state when no recipes owned', async () => {
    vi.mocked(getInventory).mockResolvedValue({ potions: [], materials: [], recipes: [] });
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/No recipes owned/)).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    vi.mocked(getInventory).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
