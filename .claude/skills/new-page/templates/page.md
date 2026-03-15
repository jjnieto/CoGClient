# Page Template

## Structure

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function {PageName}Page() {
  const { token } = useAuthStore();
  const [data, setData] = useState<{Type} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // const result = await apiService.getData(token);
        // setData(result);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>No data found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{Page Title}</h1>
      {/* Page content */}
    </div>
  );
}
```

## Rules

- Always handle loading, error, and empty states
- Use `'use client'` directive for pages with state/effects
- Fetch data in useEffect with proper cleanup
- Type all state with TypeScript interfaces
- Use Tailwind CSS classes for styling
