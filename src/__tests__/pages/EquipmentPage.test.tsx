import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import EquipmentPage from '../../pages/EquipmentPage';

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn((selector: (s: Record<string, unknown>) => unknown) =>
    selector({ token: 'test-token' }),
  ),
}));

vi.mock('../../services/equipment', () => ({
  listEquipment: vi.fn(),
  upgradeEquipment: vi.fn(),
}));

import { listEquipment } from '../../services/equipment';

const mockEquipment = [
  {
    id: 12, class: 8, level: 0, equippedIn: 0, timeLock: 0,
    stats: { health: 0, attack: 2000, defense: 0, dodge: 0, mastery: 0, speed: 0, luck: 0, faith: 0 },
    definition: { name: 'Wooden Sword', slot: 7, rarity: 0, gearset: 1, icon: '' },
  },
  {
    id: 13, class: 1, level: 1, equippedIn: 1, timeLock: 0,
    stats: { health: 800, attack: 0, defense: 64, dodge: 0, mastery: 0, speed: 0, luck: 0, faith: 0 },
    definition: { name: 'Leather helm', slot: 0, rarity: 0, gearset: 1, icon: '' },
  },
  {
    id: 14, class: 23, level: 0, equippedIn: 0, timeLock: 0,
    stats: { health: 1500, attack: 0, defense: 70, dodge: 50, mastery: 0, speed: 0, luck: 0, faith: 0 },
    definition: { name: 'Epic helm', slot: 0, rarity: 2, gearset: 0, icon: '' },
  },
];

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <EquipmentPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('EquipmentPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listEquipment).mockResolvedValue(mockEquipment);
  });

  it('renders equipment list with names and stats', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Wooden Sword')).toBeInTheDocument();
    });
    expect(screen.getByText('Leather helm')).toBeInTheDocument();
    expect(screen.getByText('Epic helm')).toBeInTheDocument();
  });

  it('shows rarity badges', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByText('Common').length).toBe(2);
    });
    expect(screen.getByText('Epic')).toBeInTheDocument();
  });

  it('shows slot and level info', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Weapon/)).toBeInTheDocument();
    });
    // "Lv.1" appears in both the badge and upgrade button, so use getAllByText
    expect(screen.getAllByText(/Lv\.1/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows equipped indicator', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Equipped on character #1/)).toBeInTheDocument();
    });
  });

  it('shows upgrade buttons for non-max level', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByText(/Upgrade to Lv\./i).length).toBe(3);
    });
  });

  it('shows empty state', async () => {
    vi.mocked(listEquipment).mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/no equipment yet/i)).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    vi.mocked(listEquipment).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
