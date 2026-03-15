export interface CharacterStats {
  health: number;
  attack: number;
  defense: number;
  dodge: number;
  mastery: number;
  speed: number;
  luck: number;
  faith: number;
}

export interface Character {
  id: number;
  name: string;
  race: number;
  level: number;
  experience: number;
  vitality: number;
  lastVitalityUpdate: number;
  timeLock: number;
  gear: number[];
  stats: CharacterStats;
}
