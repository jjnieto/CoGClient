# Page Test Template

## Structure

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import {PageName}Page from '../../pages/{PageName}Page';

// Mock API service
vi.mock('../../services/{resource}', () => ({
  fetchData: vi.fn(),
}));

// Mock auth store
vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn((selector) => selector({ token: 'test-token', user: { id: 1, username: 'hero1' } })),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('{PageName}Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderWithProviders(<{PageName}Page />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders data after loading', async () => {
    // Mock successful API response
    renderWithProviders(<{PageName}Page />);
    await waitFor(() => {
      // expect(screen.getByText('expected content')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    // Mock API error
    renderWithProviders(<{PageName}Page />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('renders empty state when no data', async () => {
    // Mock empty response
    renderWithProviders(<{PageName}Page />);
    await waitFor(() => {
      expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });
  });
});
```

## Required Test Categories

1. **Loading state** — spinner/skeleton visible during fetch
2. **Success state** — data renders correctly
3. **Error state** — error message displayed
4. **Empty state** — appropriate empty message
5. **User interactions** — clicks, form submissions trigger correct actions
6. **API calls** — correct endpoints called with correct params
