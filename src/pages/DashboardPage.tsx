import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { getMe } from '../services/auth';

export default function DashboardPage() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const { isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(token!),
    enabled: !!token,
    select: (data) => {
      setUser(data);
      return data;
    },
  });

  if (isLoading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-400">{error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Player</p>
            <p className="text-xl font-bold">{user.username}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">COG Balance</p>
            <p className="text-xl font-bold text-amber-400">{user.cogBalance}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Status</p>
            <p className="text-xl font-bold text-green-400">Online</p>
          </div>
        </div>
      )}
    </div>
  );
}
