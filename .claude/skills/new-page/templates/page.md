# Page Template

## Structure

```tsx
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { fetchData } from '../services/{resource}';

export default function {PageName}Page() {
  const token = useAuthStore((s) => s.token);

  const { data, isLoading, error } = useQuery({
    queryKey: ['{resource}'],
    queryFn: () => fetchData(token!),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error.message}</div>;
  if (!data || (Array.isArray(data) && data.length === 0)) return <div>No data found.</div>;

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
- Use TanStack Query for data fetching (useQuery for reads, useMutation for writes)
- Type all data with TypeScript interfaces
- Use Tailwind CSS classes for styling
- Use relative imports (e.g., `../stores/authStore`)
