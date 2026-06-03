export interface Player {
  id: string;
  name: string;
  level?: number;
  xp?: number;
  wealth?: number;
  bountyEarned?: number;
  casesOpened?: number;
  totalDamage?: number;
  weeklyDamage?: number;
}

export interface SearchResult {
  players: Player[];
  total: number;
}

export interface PlayerStats {
  xp: number;
  wealth: number;
  bountyEarned: number;
  casesOpened: number;
  totalDamage: number;
  weeklyDamage: number;
}