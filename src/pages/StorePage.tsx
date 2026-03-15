import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { getCatalog, purchase } from '../services/store';
import { ApiError } from '../services/client';
import type { PurchaseRequest } from '../types/store';

const CLASS_LABELS: Record<number, string> = {
  0: 'Characters',
  1: 'Equipment',
  2: 'Potions',
  3: 'Materials',
  4: 'Recipes',
};

const RARITY_COLORS: Record<number, string> = {
  0: 'text-slate-300',
  1: 'text-green-500',
  2: 'text-cyan-400',
  3: 'text-purple-500',
  4: 'text-pink-500',
};

function getCategoryClass(category: string): number {
  const map: Record<string, number> = {
    characters: 0,
    equipment: 1,
    potions: 2,
    materials: 3,
    recipes: 4,
  };
  return map[category] ?? 0;
}

export default function StorePage() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [charName, setCharName] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(1);

  const { data: catalog, isLoading, error: fetchError } = useQuery({
    queryKey: ['store'],
    queryFn: () => getCatalog(token!),
    enabled: !!token,
  });

  const handlePurchase = async (category: string, storeIndex: number, itemClass?: number) => {
    setMessage(null);
    setError(null);

    const cls = itemClass ?? getCategoryClass(category);

    if (cls === 0 && !charName.trim()) {
      setError('Please enter a character name');
      return;
    }

    setPurchasing(true);
    try {
      const req: PurchaseRequest = {
        class: cls,
        storeIndex,
        amount: (cls === 0 || cls === 1) ? 1 : selectedAmount,
      };
      if (cls === 0) {
        req.characterName = charName.trim();
      }

      const res = await purchase(token!, req);
      setMessage(`Purchased! Spent ${res.cogSpent} COG. New balance: ${res.newBalance}`);
      setCharName('');
      setSelectedAmount(1);

      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['store'] });
      if (cls === 0) queryClient.invalidateQueries({ queryKey: ['characters'] });
      if (cls === 1) queryClient.invalidateQueries({ queryKey: ['equipment'] });
      if (cls === 2 || cls === 3 || cls === 4) queryClient.invalidateQueries({ queryKey: ['items'] });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setPurchasing(false);
    }
  };

  if (isLoading) return <div className="text-gray-400">Loading...</div>;
  if (fetchError) return <div className="text-red-400">{fetchError.message}</div>;
  if (!catalog) return <div className="text-gray-400">No store data.</div>;

  const categories = [
    { key: 'characters', label: CLASS_LABELS[0]!, items: catalog.characters },
    { key: 'equipment', label: CLASS_LABELS[1]!, items: catalog.equipment },
    { key: 'potions', label: CLASS_LABELS[2]!, items: catalog.potions },
    { key: 'materials', label: CLASS_LABELS[3]!, items: catalog.materials },
    { key: 'recipes', label: CLASS_LABELS[4]!, items: catalog.recipes },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Store</h1>

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

      <div className="space-y-8">
        {categories.map(({ key, label, items }) => (
          <section key={key}>
            <h2 className="text-lg font-bold text-amber-400 mb-3">{label}</h2>
            {items.length === 0 ? (
              <p className="text-gray-500 text-sm">No items available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {items.map((item, index) => (
                  <div
                    key={`${key}-${index}`}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col justify-between"
                  >
                    <div>
                      <p className={`font-medium ${key === 'equipment' ? RARITY_COLORS[0] ?? '' : ''}`}>
                        {item.name}
                      </p>
                      <p className="text-amber-400 text-sm mt-1">{item.price} COG</p>
                    </div>

                    <div className="mt-3">
                      {key === 'characters' && (
                        <input
                          type="text"
                          placeholder="Character name"
                          value={charName}
                          onChange={(e) => setCharName(e.target.value)}
                          maxLength={32}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-gray-100 mb-2 focus:outline-none focus:border-amber-500"
                        />
                      )}

                      {key !== 'characters' && key !== 'equipment' && (
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-gray-400 text-xs">Qty:</label>
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={selectedAmount}
                            onChange={(e) => setSelectedAmount(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      )}

                      <button
                        onClick={() => handlePurchase(key, index)}
                        disabled={purchasing}
                        className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 text-white text-sm font-medium rounded py-1.5 transition-colors"
                      >
                        {purchasing ? 'Buying...' : 'Buy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
