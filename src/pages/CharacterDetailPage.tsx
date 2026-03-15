import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { getCharacter, levelUp, equipGear, usePotion } from '../services/characters';
import { listEquipment } from '../services/equipment';
import { getInventory } from '../services/items';
import { RACE_NAMES, STAT_NAMES, SLOT_NAMES, xpForNextLevel } from '../lib/stats';
import { useVitality } from '../hooks/useVitality';
import { useTimeLock } from '../hooks/useTimeLock';
import { MAX_VITALITY, formatVitality } from '../lib/vitality';
import { RarityBadge } from '../components/equipment/RarityBadge';
import { getRewardStatus, claimReward } from '../services/rewards';
import { ApiError } from '../services/client';
import type { Equipment } from '../types/equipment';

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
            <VitalityPotionButton characterId={character.id} token={token!} />
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
        <GearSection character={character} token={token!} isLocked={isLocked} />

        {/* Rewards */}
        <RewardsSection characterId={character.id} characterLevel={character.level} token={token!} />
      </div>
    </div>
  );
}

function VitalityPotionButton({ characterId, token }: { characterId: number; token: string }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const { data: inventory } = useQuery({
    queryKey: ['items'],
    queryFn: () => getInventory(token),
    enabled: !!token,
  });

  const hasVitalityPotion = inventory?.potions.some((p) => p.index === 5 && p.quantity > 0);

  if (!hasVitalityPotion) return null;

  const handleUse = async () => {
    setMsg(null);
    setLoading(true);
    try {
      await usePotion(token, characterId, 5);
      setMsg('Vitality restored!');
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      {msg && <p className="text-xs text-green-400 mb-1">{msg}</p>}
      <button
        onClick={handleUse}
        disabled={loading}
        className="bg-green-700 hover:bg-green-600 disabled:bg-gray-600 text-white text-xs font-medium rounded px-3 py-1 transition-colors"
      >
        {loading ? 'Using...' : 'Use Vitality Potion'}
      </button>
    </div>
  );
}

function GearSection({ character, token, isLocked }: { character: import('../types/character').Character; token: string; isLocked: boolean }) {
  const queryClient = useQueryClient();
  const [equipError, setEquipError] = useState<string | null>(null);
  const [equipMessage, setEquipMessage] = useState<string | null>(null);

  const { data: allEquipment } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => listEquipment(token),
    enabled: !!token,
  });

  const equippedMap = new Map<number, Equipment>();
  if (allEquipment) {
    for (const eq of allEquipment) {
      if (character.gear.includes(eq.id)) {
        equippedMap.set(eq.id, eq);
      }
    }
  }

  const getCompatible = (slotIndex: number): Equipment[] => {
    if (!allEquipment) return [];
    return allEquipment.filter((eq) => {
      if (eq.timeLock > Math.trunc(Date.now() / 1000)) return false;
      if (eq.equippedIn > 0 && eq.equippedIn !== character.id) return false;
      return eq.definition.slot === slotIndex || eq.definition.slot === 100;
    });
  };

  const handleSlotChange = async (slotIndex: number, equipmentId: number) => {
    setEquipError(null);
    setEquipMessage(null);
    const newGear = [...character.gear];
    // Remove this equipment from any other slot
    for (let i = 0; i < newGear.length; i++) {
      if (newGear[i] === equipmentId && i !== slotIndex) {
        newGear[i] = 0;
      }
    }
    newGear[slotIndex] = equipmentId;

    try {
      await equipGear(token, character.id, newGear);
      setEquipMessage('Gear updated!');
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    } catch (err) {
      if (err instanceof ApiError) {
        setEquipError(err.message);
      } else {
        setEquipError('Failed to equip gear');
      }
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:col-span-2">
      <h2 className="font-bold mb-3">Equipped Gear</h2>

      {equipMessage && (
        <div className="bg-green-900/50 border border-green-700 text-green-300 text-sm rounded p-2 mb-3">
          {equipMessage}
        </div>
      )}
      {equipError && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded p-2 mb-3">
          {equipError}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {SLOT_NAMES.map((slotName, i) => {
          const equippedId = character.gear[i] ?? 0;
          const equipped = equippedId > 0 ? equippedMap.get(equippedId) : undefined;
          const compatible = getCompatible(i);

          return (
            <div key={i} className="bg-gray-700 border border-gray-600 rounded p-2 text-xs">
              <p className="text-gray-500 mb-1 font-medium">{slotName}</p>
              {equipped ? (
                <div className="mb-1">
                  <p className="text-amber-400">{equipped.definition.name}</p>
                  <RarityBadge rarity={equipped.definition.rarity} className="mt-0.5" />
                </div>
              ) : (
                <p className="text-gray-600 mb-1">Empty</p>
              )}
              <select
                value={equippedId}
                onChange={(e) => handleSlotChange(i, Number(e.target.value))}
                disabled={isLocked}
                className="w-full bg-gray-800 border border-gray-600 rounded px-1 py-0.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500"
              >
                <option value={0}>-- None --</option>
                {compatible.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.definition.name} (Lv.{eq.level})
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RewardsSection({ characterId, characterLevel, token }: { characterId: number; characterLevel: number; token: string }) {
  const queryClient = useQueryClient();
  const [claimMsg, setClaimMsg] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const { data: rewardStatus } = useQuery({
    queryKey: ['rewards', characterId],
    queryFn: () => getRewardStatus(token, characterId),
    enabled: !!token,
  });

  const handleClaim = async (level: number) => {
    setClaimMsg(null);
    setClaimError(null);
    setClaiming(true);
    try {
      const res = await claimReward(token, { characterId, level });
      setClaimMsg(`Reward claimed! Chest #${res.chest.id} created — open it from the Chests page.`);
      queryClient.invalidateQueries({ queryKey: ['rewards', characterId] });
      queryClient.invalidateQueries({ queryKey: ['chests'] });
    } catch (err) {
      setClaimError(err instanceof ApiError ? err.message : 'Failed to claim');
    } finally {
      setClaiming(false);
    }
  };

  if (!rewardStatus) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:col-span-2">
      <h2 className="font-bold mb-3">Level Rewards</h2>

      {claimMsg && (
        <div className="bg-green-900/50 border border-green-700 text-green-300 text-sm rounded p-2 mb-3">
          {claimMsg}
        </div>
      )}
      {claimError && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded p-2 mb-3">
          {claimError}
        </div>
      )}

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {rewardStatus.claims.map((claimed, level) => {
          const canClaim = !claimed && characterLevel >= level;
          const locked = !claimed && characterLevel < level;

          return (
            <div
              key={level}
              className={`text-center rounded p-2 text-xs border ${
                claimed
                  ? 'bg-gray-700 border-gray-600 text-gray-500'
                  : canClaim
                  ? 'bg-amber-900/30 border-amber-700 text-amber-400'
                  : 'bg-gray-900 border-gray-700 text-gray-600'
              }`}
            >
              <p className="font-bold">Lv.{level}</p>
              {claimed ? (
                <p className="text-xs mt-1">Claimed</p>
              ) : canClaim ? (
                <button
                  onClick={() => handleClaim(level)}
                  disabled={claiming}
                  className="mt-1 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 text-white text-xs rounded px-1.5 py-0.5 transition-colors"
                >
                  Claim
                </button>
              ) : locked ? (
                <p className="text-xs mt-1">Locked</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
