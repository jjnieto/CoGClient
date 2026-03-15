import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { listCharacters } from '../services/characters';
import { RACE_NAMES, xpForNextLevel } from '../lib/stats';
import { useVitality } from '../hooks/useVitality';
import { useTimeLock } from '../hooks/useTimeLock';
import { MAX_VITALITY, formatVitality } from '../lib/vitality';
import type { Character } from '../types/character';

function CharacterCard({ character }: { character: Character }) {
  const vitality = useVitality(character.vitality, character.lastVitalityUpdate);
  const { isLocked, secondsRemaining } = useTimeLock(character.timeLock);
  const vitalityPercent = Math.trunc((vitality / MAX_VITALITY) * 100);
  const raceName = RACE_NAMES[character.race] ?? 'Unknown';

  return (
    <Link
      to={`/characters/${character.id}`}
      className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-amber-500 transition-colors block"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-bold text-lg">{character.name}</p>
          <p className="text-gray-400 text-sm">{raceName} &middot; Lv.{character.level}</p>
        </div>
        {isLocked && (
          <span className="bg-red-900/50 text-red-400 text-xs px-2 py-1 rounded">
            Locked {secondsRemaining}s
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 text-sm mb-3">
        <div>
          <span className="text-gray-500">HP</span>
          <span className="ml-1">{character.stats.health}</span>
        </div>
        <div>
          <span className="text-gray-500">ATK</span>
          <span className="ml-1">{character.stats.attack}</span>
        </div>
        <div>
          <span className="text-gray-500">DEF</span>
          <span className="ml-1">{character.stats.defense}</span>
        </div>
        <div>
          <span className="text-gray-500">DDG</span>
          <span className="ml-1">{character.stats.dodge}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Vitality</span>
            <span>{formatVitality(vitality)} ({vitalityPercent}%)</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 rounded-full h-2 transition-all"
              style={{ width: `${vitalityPercent}%` }}
            />
          </div>
        </div>

        {(() => {
          const xpNeeded = xpForNextLevel(character.level);
          if (!xpNeeded) return (
            <div className="flex justify-between text-xs text-gray-400">
              <span>XP</span>
              <span className="text-amber-400">MAX LEVEL</span>
            </div>
          );
          const xpPercent = Math.min(100, Math.trunc((character.experience / xpNeeded) * 100));
          return (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>XP</span>
                <span>{character.experience} / {xpNeeded} ({xpPercent}%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2 transition-all"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          );
        })()}
      </div>
    </Link>
  );
}

export default function CharactersPage() {
  const token = useAuthStore((s) => s.token);

  const { data: characters, isLoading, error } = useQuery({
    queryKey: ['characters'],
    queryFn: () => listCharacters(token!),
    enabled: !!token,
  });

  if (isLoading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-400">{error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Characters</h1>

      {!characters || characters.length === 0 ? (
        <div className="text-gray-500">
          No characters yet.{' '}
          <Link to="/store" className="text-amber-400 hover:underline">
            Buy one from the Store
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>
      )}
    </div>
  );
}
