import { getAllScores as getSupabaseScores, getScoreByGameId as getSupabaseScoreByGameId } from './supabase-data';

export interface GameScore {
  gameID: string;
  date: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
}

/**
 * Get all scores from Supabase
 */
export async function getAllScores(): Promise<GameScore[]> {
  const scores = await getSupabaseScores();
  return scores.map(score => ({
    gameID: score.game_id,
    date: score.date,
    team1: score.team1,
    team2: score.team2,
    score1: score.score1,
    score2: score.score2,
  }));
}

/**
 * Get score for a specific game by gameID
 */
export async function getScoreForGame(gameID: string): Promise<GameScore | null> {
  const score = await getSupabaseScoreByGameId(gameID);
  if (!score) return null;
  
  return {
    gameID: score.game_id,
    date: score.date,
    team1: score.team1,
    team2: score.team2,
    score1: score.score1,
    score2: score.score2,
  };
}

/**
 * Get score by date and teams (legacy fallback)
 */
export async function getScoreByTeamsAndDate(date: string, team1: string, team2: string): Promise<GameScore | null> {
  const scores = await getAllScores();
  
  // Try to find exact match
  const exactMatch = scores.find(
    (score) => 
      score.date === date && 
      score.team1 === team1 && 
      score.team2 === team2
  );
  
  if (exactMatch) return exactMatch;
  
  // Try to find match with reversed teams
  const reversedMatch = scores.find(
    (score) => 
      score.date === date && 
      score.team1 === team2 && 
      score.team2 === team1
  );
  
  if (reversedMatch) {
    // Return with swapped scores
    return {
      gameID: reversedMatch.gameID,
      date: reversedMatch.date,
      team1: team2,
      team2: team1,
      score1: reversedMatch.score2,
      score2: reversedMatch.score1,
    };
  }
  
  return null;
}

/**
 * Get scores statistics
 */
export async function getScoresStats() {
  const scores = await getAllScores();
  
  return {
    totalGames: scores.length,
    totalGoals: scores.reduce((sum, score) => sum + score.score1 + score.score2, 0),
    averageGoalsPerGame: scores.length > 0 
      ? (scores.reduce((sum, score) => sum + score.score1 + score.score2, 0) / scores.length).toFixed(1)
      : '0',
  };
}

