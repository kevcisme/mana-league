import { getScoresFromStorage } from './csv-parser';

export interface GameScore {
  gameID: string;
  date: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
}

/**
 * Get all scores from storage
 */
export function getAllScores(): GameScore[] {
  const scores = getScoresFromStorage();
  return scores || [];
}

/**
 * Get score for a specific game by gameID
 */
export function getScoreForGame(gameID: string): GameScore | null {
  const scores = getAllScores();
  return scores.find(score => score.gameID === gameID) || null;
}

/**
 * Get score by date and teams (legacy fallback)
 */
export function getScoreByTeamsAndDate(date: string, team1: string, team2: string): GameScore | null {
  const scores = getAllScores();
  
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
export function getScoresStats() {
  const scores = getAllScores();
  
  return {
    totalGames: scores.length,
    totalGoals: scores.reduce((sum, score) => sum + score.score1 + score.score2, 0),
    averageGoalsPerGame: scores.length > 0 
      ? (scores.reduce((sum, score) => sum + score.score1 + score.score2, 0) / scores.length).toFixed(1)
      : '0',
  };
}

