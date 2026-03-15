import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { listQuests, playQuest } from '../services/quests';
import { listCharacters } from '../services/characters';
import { getInventory } from '../services/items';
import { useEnemies, usePotions } from '../hooks/useGameData';
import { ApiError } from '../services/client';
import type { PlayQuestResponse } from '../types/quest';

const DIFFICULTY_LABELS = ['Normal', 'Hard', 'Expert', 'Master', 'Legendary'];
const ENEMY_MULT = [100, 300, 600, 1000, 1500];

export default function QuestsPage() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [selectedCharId, setSelectedCharId] = useState<number>(0);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [selectedPotionId, setSelectedPotionId] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState<PlayQuestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: quests, isLoading, error: fetchError } = useQuery({
    queryKey: ['quests'],
    queryFn: () => listQuests(token!),
    enabled: !!token,
  });

  const { data: characters } = useQuery({
    queryKey: ['characters'],
    queryFn: () => listCharacters(token!),
    enabled: !!token,
  });

  const { data: enemies } = useEnemies();
  const { data: potionDefs } = usePotions();

  const { data: inventory } = useQuery({
    queryKey: ['items'],
    queryFn: () => getInventory(token!),
    enabled: !!token,
  });

  // Combat potions: those with statToBoost[0] != 8 (not vitality) and owned
  const combatPotions = inventory?.potions
    .filter((p) => {
      const def = potionDefs?.find((d) => d.id === p.index);
      return def && def.statToBoost[0] !== 8 && p.index !== 0;
    })
    .map((p) => ({
      ...p,
      name: potionDefs?.find((d) => d.id === p.index)?.name ?? `Potion #${p.index}`,
    })) ?? [];

  const handlePlay = async (questIndex: number) => {
    if (!selectedCharId) {
      setError('Select a character first');
      return;
    }
    setError(null);
    setResult(null);
    setPlaying(true);

    try {
      const res = await playQuest(token!, {
        questIndex,
        characterId: selectedCharId,
        questLevel: selectedLevel,
        potionId: selectedPotionId,
      });
      setResult(res);
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['chests'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setPlaying(false);
    }
  };

  if (isLoading) return <div className="text-gray-400">Loading...</div>;
  if (fetchError) return <div className="text-red-400">{fetchError.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quests</h1>

      {/* Character & difficulty selectors */}
      <div className="flex flex-wrap gap-4 mb-6 bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Character</label>
          <select
            value={selectedCharId}
            onChange={(e) => setSelectedCharId(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
          >
            <option value={0}>-- Select --</option>
            {characters?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (Lv.{c.level})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
          >
            {DIFFICULTY_LABELS.map((label, i) => (
              <option key={i} value={i}>
                {label} ({ENEMY_MULT[i]}%)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Combat Potion</label>
          <select
            value={selectedPotionId}
            onChange={(e) => setSelectedPotionId(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
          >
            <option value={0}>None</option>
            {combatPotions.map((p) => (
              <option key={p.index} value={p.index}>
                {p.name} (x{p.quantity})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result display */}
      {result && (
        <div className="bg-gray-800 border border-amber-700 rounded-lg p-4 mb-6">
          <h2 className="font-bold text-amber-400 mb-2">Quest Result</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-400">Combat</span>
              <p className="font-bold text-lg">{result.combatPercentage}%</p>
            </div>
            <div>
              <span className="text-gray-400">XP Earned</span>
              <p className="font-bold text-lg">{result.experience}</p>
            </div>
            <div>
              <span className="text-gray-400">Level</span>
              <p className="font-bold text-lg">
                {result.newLevel}
                {result.levelUp && <span className="text-green-400 ml-1">UP!</span>}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Lock Time</span>
              <p className="font-bold text-lg">{result.missionTime}s</p>
            </div>
          </div>
          {result.chest && (
            <p className="text-green-400 text-sm mt-2">Chest obtained! Check the Chests page.</p>
          )}
          {result.guaranteedDrops.length > 0 && (
            <p className="text-blue-400 text-sm mt-1">
              Guaranteed drops: {result.guaranteedDrops.map((d) => `${d.amount}x item(${d.class}:${d.index})`).join(', ')}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded p-3 mb-4">
          {error}
        </div>
      )}

      {/* Quest list */}
      {!quests || quests.length === 0 ? (
        <p className="text-gray-500">No quests available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quests.map((quest) => {
            const enemy = enemies?.find((e) => e.id === quest.enemyIndex);
            return (
              <div
                key={quest.index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4"
              >
                <h3 className="font-bold mb-1">{quest.name}</h3>
                <p className="text-gray-500 text-xs mb-2">{quest.description}</p>

                <div className="grid grid-cols-2 gap-1 text-xs text-gray-400 mb-3">
                  <span>Enemy: <span className="text-gray-200">{enemy?.name ?? `#${quest.enemyIndex}`}</span></span>
                  <span>Vitality: <span className="text-amber-400">{quest.vitalityCost}</span></span>
                  <span>Base XP: <span className="text-blue-400">{quest.experience}</span></span>
                  <span>Luck: <span className="text-green-400">{(quest.luck / 100).toFixed(1)}%</span></span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePlay(quest.index)}
                    disabled={playing || !selectedCharId}
                    className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 text-white text-sm font-medium rounded py-1.5 transition-colors"
                  >
                    {playing ? 'Playing...' : 'Auto'}
                  </button>
                  <button
                    onClick={() => navigate(`/combat?quest=${quest.index}&char=${selectedCharId}&level=${selectedLevel}`)}
                    disabled={!selectedCharId}
                    className="flex-1 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-600 text-white text-sm font-medium rounded py-1.5 transition-colors"
                  >
                    Turn-Based
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
