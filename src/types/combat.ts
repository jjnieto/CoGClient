export type CombatAction = 'attack_normal' | 'attack_heavy' | 'attack_quick' | 'defend' | 'potion' | 'flee';

export type CombatStatus = 'active' | 'won' | 'lost' | 'fled' | 'timeout';

export interface CombatPlayer {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  dodge: number;
}

export interface CombatEnemy {
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
}

export interface CombatPotion {
  index: number;
  name: string;
  quantity: number;
  boost: number;
  stat: string;
}

export interface PlayerHit {
  damage: number;
  effectiveDamage: number;
  enemyKilled: boolean;
}

export interface EnemyHit {
  damage: number;
  effectiveDamage: number;
  dodged: boolean;
  playerKilled: boolean;
}

export interface TurnResult {
  playerAction: string;
  playerHit: PlayerHit | null;
  enemyHit: EnemyHit | null;
}

export interface CombatResult {
  combatPercentage: number;
  experience: number;
  levelUp: boolean;
  newLevel: number;
  missionTime: number;
  chest: { id: number } | null;
  guaranteedDrops: { class: number; index: number; amount: number }[];
}

export interface CombatStartResponse {
  combatId: number;
  initiative: 'player' | 'enemy';
  round: number;
  maxRounds: number;
  player: CombatPlayer;
  enemy: CombatEnemy;
  ambushHit: EnemyHit | null;
  status: CombatStatus;
  availableActions: CombatAction[];
  availablePotions: CombatPotion[];
}

export interface CombatActionResponse {
  combatId: number;
  round: number;
  turnResult: TurnResult;
  player: CombatPlayer;
  enemy: CombatEnemy;
  status: CombatStatus;
  availableActions?: CombatAction[];
  availablePotions?: CombatPotion[];
  result?: CombatResult;
}

export interface CombatAutoResponse {
  combatId: number;
  rounds: (TurnResult & { round: number })[];
  player: CombatPlayer;
  enemy: CombatEnemy;
  status: CombatStatus;
  result?: CombatResult;
}
