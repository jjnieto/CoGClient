import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { getInventory } from '../services/items';
import { craft } from '../services/crafting';
import { useRecipes, useMaterials, usePotions } from '../hooks/useGameData';
import { ApiError } from '../services/client';
import type { CraftResponse } from '../services/crafting';

export default function CraftingPage() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const [crafting, setCrafting] = useState(false);
  const [result, setResult] = useState<CraftResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: inventory, isLoading: invLoading } = useQuery({
    queryKey: ['items'],
    queryFn: () => getInventory(token!),
    enabled: !!token,
  });

  const { data: recipeDefs, isLoading: recLoading } = useRecipes();
  const { data: materialDefs } = useMaterials();
  const { data: potionDefs } = usePotions();

  const isLoading = invLoading || recLoading;

  // Recipes the user owns
  const ownedRecipes = inventory?.recipes ?? [];

  const getItemName = (cls: number, index: number): string => {
    if (cls === 2) return potionDefs?.find((p) => p.id === index)?.name ?? `Potion #${index}`;
    if (cls === 3) return materialDefs?.find((m) => m.id === index)?.name ?? `Material #${index}`;
    if (cls === 4) return recipeDefs?.find((r) => r.id === index)?.name ?? `Recipe #${index}`;
    return `Item(${cls}:${index})`;
  };

  const getMaterialOwned = (index: number): number => {
    return inventory?.materials.find((m) => m.index === index)?.quantity ?? 0;
  };

  const handleCraft = async (recipeIndex: number) => {
    setResult(null);
    setError(null);
    setCrafting(true);

    try {
      const res = await craft(token!, recipeIndex);
      setResult(res);
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setCrafting(false);
    }
  };

  if (isLoading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Crafting</h1>

      {result && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-4">
          <h2 className="font-bold text-green-400 mb-2">Crafted!</h2>
          <div className="text-sm space-y-1">
            <p className="text-gray-400">Consumed:</p>
            {result.burned.map((item, i) => (
              <p key={i} className="text-red-400 ml-2">
                -{item.amount}x {getItemName(item.class, item.index)}
              </p>
            ))}
            <p className="text-gray-400 mt-2">Created:</p>
            {result.created.map((item, i) => (
              <p key={i} className="text-green-400 ml-2">
                +{item.amount}x {getItemName(item.class, item.index)}
              </p>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded p-3 mb-4">
          {error}
        </div>
      )}

      {ownedRecipes.length === 0 ? (
        <p className="text-gray-500">No recipes owned. Buy recipes from the Store or earn them from quests.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ownedRecipes.map((owned) => {
            const def = recipeDefs?.find((r) => r.id === owned.index);
            if (!def || def.id === 0) return null;

            const ingredients = def.itemToBurn.map((matIndex, i) => {
              const matName = materialDefs?.find((m) => m.id === matIndex)?.name ?? `Material #${matIndex}`;
              const needed = def.amountToBurn[i] ?? 0;
              const have = getMaterialOwned(matIndex);
              const enough = have >= needed;

              return { matName, needed, have, enough };
            });

            const canCraft = ingredients.every((ing) => ing.enough);

            return (
              <div key={owned.index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="font-bold mb-1">{def.name}</h3>
                <p className="text-gray-500 text-xs mb-3">{def.description}</p>

                <div className="space-y-1 mb-3">
                  <p className="text-gray-400 text-xs font-medium">Ingredients:</p>
                  {ingredients.map((ing, i) => (
                    <p key={i} className={`text-sm ml-2 ${ing.enough ? 'text-gray-300' : 'text-red-400'}`}>
                      {ing.needed}x {ing.matName}
                      <span className="text-gray-500 ml-1">(have {ing.have})</span>
                    </p>
                  ))}
                </div>

                <div className="mb-3">
                  <p className="text-gray-400 text-xs font-medium">Output:</p>
                  {def.itemToMint.map((itemIndex, i) => {
                    const cls = def.classToMint[i] ?? 3;
                    const amount = def.amountToMint[i] ?? 1;
                    return (
                      <p key={i} className="text-green-400 text-sm ml-2">
                        {amount}x {getItemName(cls, itemIndex)}
                      </p>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleCraft(owned.index)}
                  disabled={crafting || !canCraft}
                  className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 text-white text-sm font-medium rounded py-1.5 transition-colors"
                >
                  {crafting ? 'Crafting...' : canCraft ? 'Craft' : 'Missing materials'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
