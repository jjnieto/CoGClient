import { describe, it, expect, beforeEach } from 'vitest';
import { useCombatStore } from '../../stores/combatStore';

describe('combatStore', () => {
  beforeEach(() => {
    useCombatStore.getState().clearCombat();
  });

  it('starts with no active combat', () => {
    const state = useCombatStore.getState();
    expect(state.combatId).toBeNull();
    expect(state.status).toBeNull();
  });

  it('setCombat initializes combat state', () => {
    useCombatStore.getState().setCombat({
      combatId: 42,
      round: 1,
      maxRounds: 10,
      player: { health: 10000, maxHealth: 10000, attack: 5000, defense: 1000, dodge: 28 },
      enemy: { name: 'Rat', health: 5000, maxHealth: 5000, attack: 2000, defense: 500 },
      status: 'active',
      availableActions: ['attack_normal', 'defend'],
      availablePotions: [],
      initiative: 'player',
    });

    const state = useCombatStore.getState();
    expect(state.combatId).toBe(42);
    expect(state.status).toBe('active');
    expect(state.player?.health).toBe(10000);
    expect(state.enemy?.name).toBe('Rat');
    expect(state.turnLog).toHaveLength(0);
  });

  it('addTurn appends to log and updates state', () => {
    useCombatStore.getState().setCombat({
      combatId: 42, round: 1, maxRounds: 10,
      player: { health: 10000, maxHealth: 10000, attack: 5000, defense: 1000, dodge: 28 },
      enemy: { name: 'Rat', health: 5000, maxHealth: 5000, attack: 2000, defense: 500 },
      status: 'active', availableActions: ['attack_normal'], availablePotions: [], initiative: 'player',
    });

    useCombatStore.getState().addTurn(
      { playerAction: 'attack_normal', playerHit: { damage: 5000, effectiveDamage: 4500, enemyKilled: false }, enemyHit: { damage: 2000, effectiveDamage: 1000, dodged: false, playerKilled: false } },
      2,
      { health: 9000, maxHealth: 10000, attack: 5000, defense: 1000, dodge: 28 },
      { name: 'Rat', health: 500, maxHealth: 5000, attack: 2000, defense: 500 },
      'active',
    );

    const state = useCombatStore.getState();
    expect(state.turnLog).toHaveLength(1);
    expect(state.round).toBe(2);
    expect(state.player?.health).toBe(9000);
    expect(state.enemy?.health).toBe(500);
  });

  it('clearCombat resets everything', () => {
    useCombatStore.getState().setCombat({
      combatId: 42, round: 1, maxRounds: 10,
      player: { health: 10000, maxHealth: 10000, attack: 5000, defense: 1000, dodge: 28 },
      enemy: { name: 'Rat', health: 5000, maxHealth: 5000, attack: 2000, defense: 500 },
      status: 'active', availableActions: ['attack_normal'], availablePotions: [], initiative: 'player',
    });

    useCombatStore.getState().clearCombat();

    const state = useCombatStore.getState();
    expect(state.combatId).toBeNull();
    expect(state.player).toBeNull();
    expect(state.turnLog).toHaveLength(0);
  });
});
