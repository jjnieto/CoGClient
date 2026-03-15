import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { getMe } from '../services/auth';
import { withdraw } from '../services/faucet';
import { ApiError } from '../services/client';

export default function DashboardPage() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const [faucetLoading, setFaucetLoading] = useState(false);
  const [faucetMessage, setFaucetMessage] = useState<string | null>(null);
  const [faucetError, setFaucetError] = useState<string | null>(null);

  const { isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(token!),
    enabled: !!token,
    select: (data) => {
      setUser(data);
      return data;
    },
  });

  const handleWithdraw = async () => {
    setFaucetMessage(null);
    setFaucetError(null);
    setFaucetLoading(true);

    try {
      const res = await withdraw(token!);
      setFaucetMessage(`+${res.amount} COG received! Total withdrawn: ${res.totalWithdrawn}/2500`);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    } catch (err) {
      if (err instanceof ApiError) {
        setFaucetError(err.message);
      } else {
        setFaucetError('An unexpected error occurred');
      }
    } finally {
      setFaucetLoading(false);
    }
  };

  if (isLoading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-400">{error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-md">
        <h2 className="text-lg font-bold mb-2">Dev Faucet</h2>
        <p className="text-gray-400 text-sm mb-4">
          Get free COG for testing. 500 COG per click, max 2500 total (5 uses).
        </p>

        {faucetMessage && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 text-sm rounded p-3 mb-3">
            {faucetMessage}
          </div>
        )}

        {faucetError && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded p-3 mb-3">
            {faucetError}
          </div>
        )}

        <button
          onClick={handleWithdraw}
          disabled={faucetLoading}
          className="bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 text-white font-medium rounded px-4 py-2 transition-colors"
        >
          {faucetLoading ? 'Withdrawing...' : 'Get Free COG'}
        </button>
      </div>
    </div>
  );
}
