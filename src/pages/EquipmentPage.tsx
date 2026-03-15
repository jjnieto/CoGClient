import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { listEquipment, upgradeEquipment } from '../services/equipment';
import { RarityBadge, getRarityColor } from '../components/equipment/RarityBadge';
import { useTimeLock } from '../hooks/useTimeLock';
import { SLOT_NAMES, STAT_NAMES } from '../lib/stats';
import { ApiError } from '../services/client';
import type { Equipment } from '../types/equipment';

function EquipmentCard({ eq, onUpgrade }: { eq: Equipment; onUpgrade: (id: number) => void }) {
  const { isLocked, secondsRemaining } = useTimeLock(eq.timeLock);
  const slotName = eq.definition.slot === 100 ? 'Any' : (SLOT_NAMES[eq.definition.slot] ?? '?');
  const nameColor = getRarityColor(eq.definition.rarity);

  const statsArray = [
    eq.stats.health, eq.stats.attack, eq.stats.defense, eq.stats.dodge,
    eq.stats.mastery, eq.stats.speed, eq.stats.luck, eq.stats.faith,
  ];
  const nonZeroStats = statsArray
    .map((val, i) => ({ name: STAT_NAMES[i]!, val }))
    .filter((s) => s.val > 0);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className={`font-medium ${nameColor}`}>{eq.definition.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <RarityBadge rarity={eq.definition.rarity} />
            <span className="text-gray-500 text-xs">{slotName} &middot; Lv.{eq.level}</span>
          </div>
        </div>
        {isLocked && (
          <span className="bg-red-900/50 text-red-400 text-xs px-2 py-1 rounded">
            {secondsRemaining}s
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm mt-2">
        {nonZeroStats.map((s) => (
          <span key={s.name}>
            <span className="text-gray-500">{s.name}</span> {s.val}
          </span>
        ))}
      </div>

      {eq.equippedIn > 0 && (
        <p className="text-xs text-amber-400 mt-2">Equipped on character #{eq.equippedIn}</p>
      )}

      {eq.level < 4 && (
        <button
          onClick={() => onUpgrade(eq.id)}
          disabled={isLocked}
          className="mt-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white text-xs font-medium rounded px-3 py-1 transition-colors"
        >
          Upgrade to Lv.{eq.level + 1}
        </button>
      )}
    </div>
  );
}

export default function EquipmentPage() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: equipment, isLoading, error: fetchError } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => listEquipment(token!),
    enabled: !!token,
  });

  const handleUpgrade = async (id: number) => {
    setMessage(null);
    setError(null);
    try {
      const result = await upgradeEquipment(token!, id);
      setMessage(`${result.definition.name} upgraded to Lv.${result.level}!`);
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
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
      <h1 className="text-2xl font-bold mb-6">Equipment</h1>

      {message && (
        <div className="bg-green-900/50 border border-green-700 text-green-300 text-sm rounded p-3 mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded p-3 mb-4">
          {error}
        </div>
      )}

      {!equipment || equipment.length === 0 ? (
        <p className="text-gray-500">No equipment yet. Buy some from the Store.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((eq) => (
            <EquipmentCard key={eq.id} eq={eq} onUpgrade={handleUpgrade} />
          ))}
        </div>
      )}
    </div>
  );
}
