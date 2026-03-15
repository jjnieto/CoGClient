import { create } from 'zustand';
import type {
  CombatPlayer,
  CombatEnemy,
  CombatStatus,
  CombatAction,
  CombatPotion,
  TurnResult,
  CombatResult,
} from '../types/combat';

interface CombatState {
  combatId: number | null;
  round: number;
  maxRounds: number;
  player: CombatPlayer | null;
  enemy: CombatEnemy | null;
  status: CombatStatus | null;
  availableActions: CombatAction[];
  availablePotions: CombatPotion[];
  turnLog: TurnResult[];
  result: CombatResult | null;
  initiative: 'player' | 'enemy' | null;

  setCombat: (data: {
    combatId: number;
    round: number;
    maxRounds: number;
    player: CombatPlayer;
    enemy: CombatEnemy;
    status: CombatStatus;
    availableActions: CombatAction[];
    availablePotions: CombatPotion[];
    initiative: 'player' | 'enemy';
  }) => void;

  addTurn: (turn: TurnResult, round: number, player: CombatPlayer, enemy: CombatEnemy, status: CombatStatus, actions?: CombatAction[], potions?: CombatPotion[], result?: CombatResult) => void;

  setResult: (status: CombatStatus, result?: CombatResult) => void;

  clearCombat: () => void;
}

export const useCombatStore = create<CombatState>((set) => ({
  combatId: null,
  round: 0,
  maxRounds: 10,
  player: null,
  enemy: null,
  status: null,
  availableActions: [],
  availablePotions: [],
  turnLog: [],
  result: null,
  initiative: null,

  setCombat: (data) => set({
    combatId: data.combatId,
    round: data.round,
    maxRounds: data.maxRounds,
    player: data.player,
    enemy: data.enemy,
    status: data.status,
    availableActions: data.availableActions,
    availablePotions: data.availablePotions,
    initiative: data.initiative,
    turnLog: [],
    result: null,
  }),

  addTurn: (turn, round, player, enemy, status, actions, potions, result) => set((state) => ({
    turnLog: [...state.turnLog, turn],
    round,
    player,
    enemy,
    status,
    availableActions: actions ?? [],
    availablePotions: potions ?? [],
    result: result ?? state.result,
  })),

  setResult: (status, result) => set({ status, result }),

  clearCombat: () => set({
    combatId: null,
    round: 0,
    player: null,
    enemy: null,
    status: null,
    availableActions: [],
    availablePotions: [],
    turnLog: [],
    result: null,
    initiative: null,
  }),
}));
