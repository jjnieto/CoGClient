import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import QuestsPage from '../../pages/QuestsPage';

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn((selector: (s: Record<string, unknown>) => unknown) =>
    selector({ token: 'test-token' }),
  ),
}));

vi.mock('../../services/quests', () => ({
  listQuests: vi.fn(),
  playQuest: vi.fn(),
}));

vi.mock('../../services/characters', () => ({
  listCharacters: vi.fn(),
}));

vi.mock('../../hooks/useGameData', () => ({
  useEnemies: vi.fn(() => ({
    data: [
      { id: 1, name: 'Rat plague', stats: [5000, 2100, 500] },
    ],
  })),
}));

import { listQuests, playQuest } from '../../services/quests';
import { listCharacters } from '../../services/characters';

const mockQuests = [
  {
    index: 0, name: 'Clean the Black Harpy',
    description: 'Isabella asks you to clean vermin.',
    icon: '', season: 0, order: 1, vitalityCost: 1900,
    enemyIndex: 1, travelTime: 30, missionTime: 30,
    luck: 700, experience: 1, drops: [],
  },
  {
    index: 1, name: 'Erradicate Hysteria',
    description: 'Clean the city from Hysteria.',
    icon: '', season: 0, order: 2, vitalityCost: 4300,
    enemyIndex: 2, travelTime: 120, missionTime: 180,
    luck: 1100, experience: 3, drops: [],
  },
];

const mockChars = [
  {
    id: 1, name: 'Ragnar', race: 0, level: 0, experience: 0,
    vitality: 86400, lastVitalityUpdate: 0, timeLock: 0,
    gear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    stats: { health: 3700, attack: 2000, defense: 450, dodge: 10, mastery: 10, speed: 10, luck: 0, faith: 0 },
  },
];

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <QuestsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('QuestsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listQuests).mockResolvedValue(mockQuests);
    vi.mocked(listCharacters).mockResolvedValue(mockChars);
  });

  it('renders quest list with names and details', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Clean the Black Harpy')).toBeInTheDocument();
    });
    expect(screen.getByText('Erradicate Hysteria')).toBeInTheDocument();
    expect(screen.getByText('Rat plague')).toBeInTheDocument();
    expect(screen.getByText('1900')).toBeInTheDocument();
  });

  it('renders character selector', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Clean the Black Harpy')).toBeInTheDocument();
    });
    expect(screen.getByText('Ragnar (Lv.0)')).toBeInTheDocument();
  });

  it('renders difficulty selector', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Normal (100%)')).toBeInTheDocument();
    });
  });

  it('disables play buttons when no character selected', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /play quest/i }).length).toBeGreaterThan(0);
    });
    const buttons = screen.getAllByRole('button', { name: /play quest/i });
    for (const btn of buttons) {
      expect(btn).toBeDisabled();
    }
  });

  it('plays quest and shows result', async () => {
    const user = userEvent.setup();
    vi.mocked(playQuest).mockResolvedValueOnce({
      levelUp: false, experience: 1, newLevel: 0,
      combatPercentage: 85, missionTime: 6,
      chest: null, guaranteedDrops: [],
    });

    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Clean the Black Harpy')).toBeInTheDocument();
    });

    // Select character
    const charSelect = screen.getAllByRole('combobox')[0]!;
    await user.selectOptions(charSelect, '1');

    // Play first quest
    await user.click(screen.getAllByRole('button', { name: /play quest/i })[0]!);

    await waitFor(() => {
      expect(screen.getByText('Quest Result')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });
  });

  it('shows error on locked character', async () => {
    const user = userEvent.setup();
    const { ApiError } = await import('../../services/client');
    vi.mocked(playQuest).mockRejectedValueOnce(new ApiError(423, 'Character is locked'));

    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Clean the Black Harpy')).toBeInTheDocument();
    });

    const charSelect = screen.getAllByRole('combobox')[0]!;
    await user.selectOptions(charSelect, '1');
    await user.click(screen.getAllByRole('button', { name: /play quest/i })[0]!);

    await waitFor(() => {
      expect(screen.getByText('Character is locked')).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    vi.mocked(listQuests).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
