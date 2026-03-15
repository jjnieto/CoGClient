import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useCombatStore } from '../stores/combatStore';
import { startCombat, submitAction, autoCombat, getCombatStatus } from '../services/combat';
import { ApiError } from '../services/client';
import type { CombatAction } from '../types/combat';

const ACTION_LABELS: Record<CombatAction, { label: string; desc: string; color: string }> = {
  attack_normal: { label: 'Attack', desc: 'Standard attack', color: 'bg-red-700 hover:bg-red-600' },
  attack_heavy: { label: 'Heavy', desc: '140% ATK, -20% DEF', color: 'bg-red-900 hover:bg-red-800' },
  attack_quick: { label: 'Quick', desc: '70% ATK, +50% dodge', color: 'bg-orange-700 hover:bg-orange-600' },
  defend: { label: 'Defend', desc: '2x DEF, heal 5%', color: 'bg-blue-700 hover:bg-blue-600' },
  potion: { label: 'Potion', desc: 'Use combat potion', color: 'bg-green-700 hover:bg-green-600' },
  flee: { label: 'Flee', desc: '30%+ chance to escape', color: 'bg-gray-600 hover:bg-gray-500' },
};

export default function CombatPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const combat = useCombatStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [potionSelectOpen, setPotionSelectOpen] = useState(false);

  // Start combat from query params or reconnect
  useEffect(() => {
    const questIndex = searchParams.get('quest');
    const characterId = searchParams.get('char');
    const questLevel = searchParams.get('level');
    const reconnectId = searchParams.get('reconnect');

    if (reconnectId && token) {
      handleReconnect(Number(reconnectId));
    } else if (questIndex && characterId && token && !combat.combatId) {
      handleStart(Number(questIndex), Number(characterId), Number(questLevel ?? 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = async (questIndex: number, characterId: number, questLevel: number) => {
    setError(null);
    setLoading(true);
    try {
      const res = await startCombat(token!, { questIndex, characterId, questLevel, ambush: false });
      combat.setCombat({
        combatId: res.combatId,
        round: res.round,
        maxRounds: res.maxRounds,
        player: res.player,
        enemy: res.enemy,
        status: res.status,
        availableActions: res.availableActions,
        availablePotions: res.availablePotions,
        initiative: res.initiative,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to start combat');
    } finally {
      setLoading(false);
    }
  };

  const handleReconnect = async (combatId: number) => {
    setError(null);
    setLoading(true);
    try {
      const res = await getCombatStatus(token!, combatId);
      combat.setCombat({
        combatId: res.combatId,
        round: res.round,
        maxRounds: res.maxRounds,
        player: res.player,
        enemy: res.enemy,
        status: res.status,
        availableActions: res.availableActions,
        availablePotions: res.availablePotions,
        initiative: res.initiative,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to reconnect');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: CombatAction, potionIndex?: number) => {
    if (!combat.combatId) return;
    setError(null);
    setLoading(true);
    setPotionSelectOpen(false);
    try {
      const res = await submitAction(token!, combat.combatId, action, potionIndex);
      combat.addTurn(
        res.turnResult,
        res.round,
        res.player,
        res.enemy,
        res.status,
        res.availableActions,
        res.availablePotions,
        res.result,
      );
      if (res.status !== 'active') {
        queryClient.invalidateQueries({ queryKey: ['characters'] });
        queryClient.invalidateQueries({ queryKey: ['chests'] });
        queryClient.invalidateQueries({ queryKey: ['items'] });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAuto = async () => {
    if (!combat.combatId) return;
    setError(null);
    setLoading(true);
    try {
      const res = await autoCombat(token!, combat.combatId);
      for (const round of res.rounds) {
        combat.addTurn(round, round.round, res.player, res.enemy, res.status);
      }
      if (res.result) {
        combat.setResult(res.status, res.result);
      }
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['chests'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Auto-combat failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    combat.clearCombat();
    navigate('/quests');
  };

  if (!combat.combatId && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">No active combat. Start one from the Quests page.</p>
        <button onClick={() => navigate('/quests')} className="text-amber-400 hover:underline">
          Go to Quests
        </button>
      </div>
    );
  }

  const isActive = combat.status === 'active';
  const isEnded = combat.status && combat.status !== 'active';
  const playerHpPct = combat.player ? Math.trunc((combat.player.health / combat.player.maxHealth) * 100) : 0;
  const enemyHpPct = combat.enemy ? Math.trunc((combat.enemy.health / combat.enemy.maxHealth) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Combat</h1>
        <span className="text-gray-400 text-sm">
          Round {combat.round}/{combat.maxRounds}
        </span>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded p-3 mb-4">
          {error}
        </div>
      )}

      {/* Health bars */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Player */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="font-bold text-blue-400 mb-1">You</p>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>HP</span>
            <span>{combat.player?.health ?? 0} / {combat.player?.maxHealth ?? 0}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
            <div className="bg-blue-500 rounded-full h-3 transition-all" style={{ width: `${playerHpPct}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
            <span>ATK {combat.player?.attack}</span>
            <span>DEF {combat.player?.defense}</span>
            <span>DDG {combat.player?.dodge}</span>
          </div>
        </div>

        {/* Enemy */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="font-bold text-red-400 mb-1">{combat.enemy?.name ?? 'Enemy'}</p>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>HP</span>
            <span>{combat.enemy?.health ?? 0} / {combat.enemy?.maxHealth ?? 0}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
            <div className="bg-red-500 rounded-full h-3 transition-all" style={{ width: `${enemyHpPct}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
            <span>ATK {combat.enemy?.attack}</span>
            <span>DEF {combat.enemy?.defense}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isActive && (
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {combat.availableActions
              .filter((a) => a !== 'potion')
              .map((action) => {
                const cfg = ACTION_LABELS[action];
                return (
                  <button
                    key={action}
                    onClick={() => handleAction(action)}
                    disabled={loading}
                    className={`${cfg.color} disabled:bg-gray-600 text-white text-sm font-medium rounded py-2 px-3 transition-colors`}
                  >
                    <span className="block">{cfg.label}</span>
                    <span className="block text-xs opacity-70">{cfg.desc}</span>
                  </button>
                );
              })}
          </div>

          {/* Potion button */}
          {combat.availableActions.includes('potion') && combat.availablePotions.length > 0 && (
            <div className="mb-2">
              {potionSelectOpen ? (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-2">
                  <p className="text-sm text-gray-400">Select potion:</p>
                  {combat.availablePotions.map((p) => (
                    <button
                      key={p.index}
                      onClick={() => handleAction('potion', p.index)}
                      disabled={loading}
                      className="w-full bg-green-800 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm rounded py-1.5 px-3 text-left transition-colors"
                    >
                      {p.name} (x{p.quantity}) — +{p.boost} {p.stat}
                    </button>
                  ))}
                  <button onClick={() => setPotionSelectOpen(false)} className="text-gray-400 text-xs hover:text-gray-200">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setPotionSelectOpen(true)}
                  disabled={loading}
                  className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-600 text-white text-sm font-medium rounded py-2 transition-colors"
                >
                  Use Potion ({combat.availablePotions.length} available)
                </button>
              )}
            </div>
          )}

          {/* Auto-combat */}
          <button
            onClick={handleAuto}
            disabled={loading}
            className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-gray-300 text-sm font-medium rounded py-2 transition-colors"
          >
            {loading ? 'Resolving...' : 'Auto-Combat (resolve all)'}
          </button>
        </div>
      )}

      {/* Result */}
      {isEnded && combat.result && (
        <div className={`border rounded-lg p-4 mb-6 ${
          combat.status === 'won' ? 'bg-green-900/30 border-green-700' :
          combat.status === 'lost' ? 'bg-red-900/30 border-red-700' :
          'bg-gray-800 border-gray-700'
        }`}>
          <h2 className="font-bold text-lg mb-2">
            {combat.status === 'won' && 'Victory!'}
            {combat.status === 'lost' && 'Defeated!'}
            {combat.status === 'fled' && 'Escaped!'}
            {combat.status === 'timeout' && 'Time Out!'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-400">Combat</span>
              <p className="font-bold">{combat.result.combatPercentage}%</p>
            </div>
            <div>
              <span className="text-gray-400">XP</span>
              <p className="font-bold">{combat.result.experience}</p>
            </div>
            <div>
              <span className="text-gray-400">Level</span>
              <p className="font-bold">
                {combat.result.newLevel}
                {combat.result.levelUp && <span className="text-green-400 ml-1">UP!</span>}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Chest</span>
              <p className="font-bold">{combat.result.chest ? 'Yes!' : 'None'}</p>
            </div>
          </div>
          <button onClick={handleExit} className="mt-4 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded px-6 py-2 transition-colors">
            Back to Quests
          </button>
        </div>
      )}

      {isEnded && !combat.result && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-400 mb-3">
            {combat.status === 'fled' ? 'You escaped!' : 'Combat ended.'}
          </p>
          <button onClick={handleExit} className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded px-6 py-2 transition-colors">
            Back to Quests
          </button>
        </div>
      )}

      {/* Turn log */}
      {combat.turnLog.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2 text-gray-400">Battle Log</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
            {[...combat.turnLog].reverse().map((turn, i) => (
              <div key={i} className="border-b border-gray-700 pb-2">
                <p className="text-blue-400">
                  You: {turn.playerAction}
                  {turn.playerHit && ` → ${turn.playerHit.effectiveDamage} dmg`}
                  {turn.playerHit?.enemyKilled && ' (KILLED!)'}
                </p>
                {turn.enemyHit && (
                  <p className="text-red-400">
                    Enemy: attack
                    {turn.enemyHit.dodged ? ' → DODGED!' : ` → ${turn.enemyHit.effectiveDamage} dmg`}
                    {turn.enemyHit.playerKilled && ' (KILLED!)'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
