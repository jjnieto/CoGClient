import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import CharactersPage from '../../pages/CharactersPage';

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn((selector: (s: Record<string, unknown>) => unknown) =>
    selector({ token: 'test-token' }),
  ),
}));

vi.mock('../../services/characters', () => ({
  listCharacters: vi.fn(),
}));

import { listCharacters } from '../../services/characters';

const mockChars = [
  {
    id: 1, name: 'Ragnar', race: 0, level: 2, experience: 15,
    vitality: 50000, lastVitalityUpdate: Math.trunc(Date.now() / 1000),
    timeLock: 0, gear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    stats: { health: 10360, attack: 5600, defense: 1260, dodge: 28, mastery: 28, speed: 28, luck: 0, faith: 0 },
  },
  {
    id: 2, name: 'Shadow', race: 2, level: 0, experience: 0,
    vitality: 86400, lastVitalityUpdate: Math.trunc(Date.now() / 1000),
    timeLock: 0, gear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    stats: { health: 900, attack: 1900, defense: 0, dodge: 70, mastery: 100, speed: 100, luck: 500, faith: 0 },
  },
];

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <CharactersPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('CharactersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listCharacters).mockResolvedValue(mockChars);
  });

  it('renders character list with names and races', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Ragnar')).toBeInTheDocument();
    });
    expect(screen.getByText('Shadow')).toBeInTheDocument();
    expect(screen.getByText(/Barbarian/)).toBeInTheDocument();
    expect(screen.getByText(/Assassin/)).toBeInTheDocument();
  });

  it('shows stats for each character', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('10360')).toBeInTheDocument();
    });
    expect(screen.getByText('5600')).toBeInTheDocument();
  });

  it('shows empty state when no characters', async () => {
    vi.mocked(listCharacters).mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/no characters yet/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/buy one from the store/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(listCharacters).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
