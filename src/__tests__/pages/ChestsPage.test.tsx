import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import ChestsPage from '../../pages/ChestsPage';

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn((selector: (s: Record<string, unknown>) => unknown) =>
    selector({ token: 'test-token' }),
  ),
}));

vi.mock('../../services/chests', () => ({
  listChests: vi.fn(),
  openChest: vi.fn(),
}));

import { listChests, openChest } from '../../services/chests';

const now = Math.trunc(Date.now() / 1000);

const mockChests = [
  { id: 5, questIndex: 0, questLevel: 0, percentage: 85, heroId: 1, mintNFT: 1, timeLock: 0, hits: [] },
  { id: 6, questIndex: 1, questLevel: 1, percentage: 100, heroId: 1, mintNFT: 1, timeLock: now + 60, hits: [] },
];

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ChestsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ChestsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listChests).mockResolvedValue(mockChests);
  });

  it('renders chest list with quest info and percentage', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Chest #5')).toBeInTheDocument();
    });
    expect(screen.getByText('Chest #6')).toBeInTheDocument();
    expect(screen.getByText(/85% combat/)).toBeInTheDocument();
    expect(screen.getByText(/100% combat/)).toBeInTheDocument();
  });

  it('shows open button for unlocked chests', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Open Chest')).toBeInTheDocument();
    });
  });

  it('shows locked countdown for locked chests', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Locked \(\d+s\)/)).toBeInTheDocument();
    });
  });

  it('opens chest and shows loot', async () => {
    const user = userEvent.setup();
    vi.mocked(openChest).mockResolvedValueOnce({
      drops: [{ class: 1, index: 9, amount: 1 }],
    });

    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Open Chest')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Open Chest'));

    await waitFor(() => {
      expect(screen.getByText('Loot Received!')).toBeInTheDocument();
      expect(screen.getByText(/Equipment #9/)).toBeInTheDocument();
    });
  });

  it('shows empty chest message', async () => {
    const user = userEvent.setup();
    vi.mocked(openChest).mockResolvedValueOnce({ drops: [] });

    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Open Chest')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Open Chest'));

    await waitFor(() => {
      expect(screen.getByText(/Chest was empty/)).toBeInTheDocument();
    });
  });

  it('shows empty state when no chests', async () => {
    vi.mocked(listChests).mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/No chests/)).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    vi.mocked(listChests).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
