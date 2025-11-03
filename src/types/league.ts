export interface Team {
  id: number;
  name: string;
  logo?: string;
  color?: string;
  wins?: number;
  losses?: number;
  draws?: number;
}

export interface Player {
  id: number;
  name: string;
  teamId: number;
  position?: string;
  jerseyNumber?: number;
  goals?: number;
  assists?: number;
}

export interface Game {
  id: number;
  date: string;
  time: string;
  team1: string;
  team2: string;
  team1Id?: number;
  team2Id?: number;
  location: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  score1?: number;
  score2?: number;
  attendance?: number;
  weather?: string;
}

export interface GameRecap {
  id: number;
  gameId: number;
  date: string;
  time: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  location: string;
  highlights: string[];
  playerOfTheMatch: string;
  attendance: number;
  weather: string;
  recap?: string;
  photos?: string[];
  stats?: GameStats;
}

export interface GameStats {
  possession?: {
    team1: number;
    team2: number;
  };
  shots?: {
    team1: number;
    team2: number;
  };
  corners?: {
    team1: number;
    team2: number;
  };
  fouls?: {
    team1: number;
    team2: number;
  };
}

export interface Season {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  teams: Team[];
}

export interface LeagueStats {
  totalGames: number;
  totalTeams: number;
  totalPlayers: number;
  totalGoals: number;
  averageAttendance: number;
  topScorer?: {
    name: string;
    goals: number;
  };
}

export interface UploadResult {
  success: boolean;
  message: string;
  recordsProcessed?: number;
  errors?: string[];
}