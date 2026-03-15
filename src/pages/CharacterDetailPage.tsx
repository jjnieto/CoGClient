import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { getCharacter, levelUp } from '../services/characters';
import { RACE_NAMES, STAT_NAMES, xpForNextLevel } from '../lib/stats';
import { useVitality } from '../hooks/useVitality';
import { useTimeLock } from '../hooks/useTimeLock';
import { MAX_VITALITY, formatVitality } from '../lib/vitality';
import { ApiError } from '../services/client';

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [levelingUp, setLevelingUp] = useState(false);

  const { data: character, isLoading, error: fetchError } = useQuery({
    queryKey: ['characters', Number(id)],
    queryFn: () => getCharacter(token!, Number(id)),
    enabled: !!token && !!id,
  });

  const vitality = useVitality(
    character?.vitality ?? 0,
    character?.lastVitalityUpdate ?? 0,
  );
  const { isLocked, secondsRemaining } = useTimeLock(character?.timeLock ?? 0);

  const handleLevelUp = async () => {
    if (!character) return;
    setMessage(null);
    setError(null);
    setLevelingUp(true);

    try {
      await levelUp(token!, character.id);
      setMessage('Level up successful!');
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLevelingUp(false);
    }
  };

  if (isLoading) return <div className="text-gray-400">Loading...</div>;
  if (fetchError) return <div className="text-red-400">{fetchError.message}</div>;
  if (!character) return <div className="text-gray-400">Character not found.</div>;

  const raceName = RACE_NAMES[character.race] ?? 'Unknown';
  const vitalityPercent = Math.trunc((vitality / MAX_VITALITY) * 100);
  const xpNeeded = xpForNextLevel(character.level);
  const statsArray = [
    character.stats.health, character.stats.attack, character.stats.defense,
    character.stats.dodge, character.stats.mastery, character.stats.speed,
    character.stats.luck, character.stats.faith,
  ];

  return (
    <div>
      <Link to="/characters" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
        &larr; Back to Characters
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{character.name}</h1>
          <p className="text-gray-400">{raceName} &middot; Level {character.level}</p>
        </div>
        {isLocked && (
          <span className="bg-red-900/50 text-red-400 text-sm px-3 py-1 rounded">
            Locked {secondsRemaining}s
          </span>
        )}
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h2 className="font-bold mb-3">Stats</h2>
          <div className="grid grid-cols-2 gap-2">
            {statsArray.map((val, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-400">{STAT_NAMES[i]}</span>
                <span className="font-mono">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vitality & XP */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4">
          <div>
            <h2 className="font-bold mb-2">Vitality</h2>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>{formatVitality(vitality)}</span>
              <span>{vitalityPercent}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-green-500 rounded-full h-3 transition-all"
                style={{ width: `${vitalityPercent}%` }}
              />
            </div>
          </div>

          <div>
            <h2 className="font-bold mb-2">Experience</h2>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">
                {character.experience} / {xpNeeded ?? 'MAX'}
              </span>
              {xpNeeded && (
                <span className="text-gray-500">
                  {Math.trunc((character.experience / xpNeeded) * 100)}%
                </span>
              )}
            </div>
            {xpNeeded && (
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 rounded-full h-3 transition-all"
                  style={{ width: `${Math.min(100, Math.trunc((character.experience / xpNeeded) * 100))}%` }}
                />
              </div>
            )}

            {xpNeeded && character.experience >= xpNeeded && (
              <button
                onClick={handleLevelUp}
                disabled={levelingUp || isLocked}
                className="mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white text-sm font-medium rounded px-4 py-1.5 transition-colors"
              >
                {levelingUp ? 'Leveling up...' : 'Level Up!'}
              </button>
            )}
          </div>
        </div>

        {/* Gear */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:col-span-2">
          <h2 className="font-bold mb-3">Equipped Gear</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {['Head', 'Neck', 'Chest', 'Belt', 'Legs', 'Feet', 'Arms', 'Weapon', 'Off-hand', 'Ring', 'Mount'].map((slot, i) => (
              <div
                key={i}
                className="bg-gray-700 border border-gray-600 rounded p-2 text-center text-xs"
              >
                <p className="text-gray-500 mb-1">{slot}</p>
                <p className="font-mono">
                  {character.gear[i] === 0 ? (
                    <span className="text-gray-600">Empty</span>
                  ) : (
                    <span className="text-amber-400">#{character.gear[i]}</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
