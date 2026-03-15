import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { listChests, openChest } from '../services/chests';
import { useTimeLock } from '../hooks/useTimeLock';
import { ApiError } from '../services/client';
import type { Chest, ChestDrop } from '../types/chest';

const DROP_CLASS_NAMES: Record<number, string> = {
  0: 'Character',
  1: 'Equipment',
  2: 'Potion',
  3: 'Material',
  4: 'Recipe',
  255: 'COG',
};

function ChestCard({ chest, onOpen }: { chest: Chest; onOpen: (id: number) => void }) {
  const { isLocked, secondsRemaining } = useTimeLock(chest.timeLock);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-bold">Chest #{chest.id}</p>
          <p className="text-gray-400 text-xs">
            Quest {chest.questIndex} &middot; Lv.{chest.questLevel} &middot; {chest.percentage}% combat
          </p>
        </div>
        {isLocked && (
          <span className="bg-red-900/50 text-red-400 text-xs px-2 py-1 rounded">
            {secondsRemaining}s
          </span>
        )}
      </div>

      <button
        onClick={() => onOpen(chest.id)}
        disabled={isLocked}
        className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 text-white text-sm font-medium rounded py-1.5 transition-colors"
      >
        {isLocked ? `Locked (${secondsRemaining}s)` : 'Open Chest'}
      </button>
    </div>
  );
}

export default function ChestsPage() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const [drops, setDrops] = useState<ChestDrop[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: chests, isLoading, error: fetchError } = useQuery({
    queryKey: ['chests'],
    queryFn: () => listChests(token!),
    enabled: !!token,
  });

  const handleOpen = async (id: number) => {
    setDrops(null);
    setMessage(null);
    setError(null);

    try {
      const res = await openChest(token!, id);
      if (res.drops.length === 0) {
        setMessage('Chest was empty! Bad luck.');
      } else {
        setDrops(res.drops);
      }
      queryClient.invalidateQueries({ queryKey: ['chests'] });
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  if (isLoading) return <div className="text-gray-400">Loading...</div>;
  if (fetchError) return <div className="text-red-400">{fetchError.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Chests</h1>

      {drops && (
        <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-4 mb-4">
          <h2 className="font-bold text-amber-400 mb-2">Loot Received!</h2>
          <ul className="space-y-1">
            {drops.map((drop, i) => (
              <li key={i} className="text-sm">
                <span className="text-amber-300">{drop.amount}x</span>{' '}
                <span className="text-gray-300">
                  {DROP_CLASS_NAMES[drop.class] ?? `Class ${drop.class}`} #{drop.index}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {message && (
        <div className="bg-gray-800 border border-gray-600 text-gray-400 text-sm rounded p-3 mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded p-3 mb-4">
          {error}
        </div>
      )}

      {!chests || chests.length === 0 ? (
        <p className="text-gray-500">No chests. Play quests to earn chests!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chests.map((chest) => (
            <ChestCard key={chest.id} chest={chest} onOpen={handleOpen} />
          ))}
        </div>
      )}
    </div>
  );
}
