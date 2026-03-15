# Page Test Template

## Structure

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import {PageName}Page from '@/app/(game)/{page-name}/page';

// Mock API service
vi.mock('@/services/api', () => ({
  getData: vi.fn(),
}));

// Mock auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({ token: 'test-token', user: { id: 1, username: 'hero1' } }),
}));

describe('{PageName}Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<{PageName}Page />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders data after loading', async () => {
    // Mock successful API response
    render(<{PageName}Page />);
    await waitFor(() => {
      // expect(screen.getByText('expected content')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    // Mock API error
    render(<{PageName}Page />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('renders empty state when no data', async () => {
    // Mock empty response
    render(<{PageName}Page />);
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
