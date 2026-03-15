import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { getInventory } from '../services/items';
import { listCharacters, usePotion } from '../services/characters';
import { usePotions, useMaterials, useRecipes } from '../hooks/useGameData';
import { ApiError } from '../services/client';
import type { InventoryItem } from '../types/item';

type Tab = 'potions' | 'materials' | 'recipes';

function PotionCard({
  item,
  name,
  description,
  onUse,
}: {
  item: InventoryItem;
  name: string;
  description: string;
  onUse?: (potionIndex: number) => void;
}) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-gray-500 text-xs">{description}</p>
        </div>
        <span className="bg-gray-700 text-gray-300 text-xs font-mono px-2 py-0.5 rounded">
          x{item.quantity}
        </span>
      </div>
      {onUse && (
        <button
          onClick={() => onUse(item.index)}
          className="mt-2 bg-green-700 hover:bg-green-600 text-white text-xs font-medium rounded px-3 py-1 transition-colors"
        >
          Use on character
        </button>
      )}
    </div>
  );
}

function ItemCard({ item, name, description }: { item: InventoryItem; name: string; description: string }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-gray-500 text-xs">{description}</p>
        </div>
        <span className="bg-gray-700 text-gray-300 text-xs font-mono px-2 py-0.5 rounded">
          x{item.quantity}
        </span>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<Tab>('potions');
  const [selectedCharId, setSelectedCharId] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: inventory, isLoading, error: fetchError } = useQuery({
    queryKey: ['items'],
    queryFn: () => getInventory(token!),
    enabled: !!token,
  });

  const { data: characters } = useQuery({
    queryKey: ['characters'],
    queryFn: () => listCharacters(token!),
    enabled: !!token,
  });

  const { data: potionDefs } = usePotions();
  const { data: materialDefs } = useMaterials();
  const { data: recipeDefs } = useRecipes();

  const handleUsePotion = async (potionIndex: number) => {
    if (!selectedCharId) {
      setError('Select a character first');
      return;
    }
    setMessage(null);
    setError(null);

    try {
      await usePotion(token!, selectedCharId, potionIndex);
      const potionName = potionDefs?.find((p) => p.id === potionIndex)?.name ?? `Potion #${potionIndex}`;
      setMessage(`Used ${potionName} on character!`);
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
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

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'potions', label: 'Potions', count: inventory?.potions.length ?? 0 },
    { key: 'materials', label: 'Materials', count: inventory?.materials.length ?? 0 },
    { key: 'recipes', label: 'Recipes', count: inventory?.recipes.length ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>

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

      {/* Character selector for potions */}
      <div className="mb-4">
        <label className="text-sm text-gray-400 mr-2">Use potions on:</label>
        <select
          value={selectedCharId}
          onChange={(e) => setSelectedCharId(Number(e.target.value))}
          className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
        >
          <option value={0}>-- Select character --</option>
          {characters?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} (Lv.{c.level})
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              tab === t.key
                ? 'bg-gray-800 text-amber-400 border border-gray-700 border-b-gray-800'
                : 'bg-gray-900 text-gray-400 hover:text-gray-200'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tab === 'potions' && (
          inventory?.potions.length === 0 ? (
            <p className="text-gray-500 col-span-full">No potions.</p>
          ) : (
            inventory?.potions.map((item) => {
              const def = potionDefs?.find((p) => p.id === item.index);
              return (
                <PotionCard
                  key={item.tokenId}
                  item={item}
                  name={def?.name ?? `Potion #${item.index}`}
                  description={def?.description ?? ''}
                  onUse={item.index === 5 ? handleUsePotion : undefined}
                />
              );
            })
          )
        )}

        {tab === 'materials' && (
          inventory?.materials.length === 0 ? (
            <p className="text-gray-500 col-span-full">No materials.</p>
          ) : (
            inventory?.materials.map((item) => {
              const def = materialDefs?.find((m) => m.id === item.index);
              return (
                <ItemCard
                  key={item.tokenId}
                  item={item}
                  name={def?.name ?? `Material #${item.index}`}
                  description={def?.description ?? ''}
                />
              );
            })
          )
        )}

        {tab === 'recipes' && (
          inventory?.recipes.length === 0 ? (
            <p className="text-gray-500 col-span-full">No recipes.</p>
          ) : (
            inventory?.recipes.map((item) => {
              const def = recipeDefs?.find((r) => r.id === item.index);
              return (
                <ItemCard
                  key={item.tokenId}
                  item={item}
                  name={def?.name ?? `Recipe #${item.index}`}
                  description={def?.description ?? ''}
                />
              );
            })
          )
        )}
      </div>
    </div>
  );
}
