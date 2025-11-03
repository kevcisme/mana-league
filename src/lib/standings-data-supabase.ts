import { getAllScores } from './supabase-data';

export interface TeamStanding {
  team: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
  avgPointDifferential: number;
}

/**
 * Calculate team standings from scores data
 */
export async function calculateStandings(): Promise<TeamStanding[]> {
  const scores = await getAllScores();
  
  // Create a map to track team statistics
  const teamStats = new Map<string, {
    wins: number;
    losses: number;
    pointsFor: number;
    pointsAgainst: number;
  }>();

  // Process each game score
  scores.forEach((score) => {
    const { team1, team2, score1, score2 } = score;

    // Initialize team1 if not exists
    if (!teamStats.has(team1)) {
      teamStats.set(team1, { wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 });
    }
    
    // Initialize team2 if not exists
    if (!teamStats.has(team2)) {
      teamStats.set(team2, { wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 });
    }

    const team1Stats = teamStats.get(team1)!;
    const team2Stats = teamStats.get(team2)!;

    // Update points
    team1Stats.pointsFor += score1;
    team1Stats.pointsAgainst += score2;
    team2Stats.pointsFor += score2;
    team2Stats.pointsAgainst += score1;

    // Update wins/losses
    if (score1 > score2) {
      team1Stats.wins += 1;
      team2Stats.losses += 1;
    } else if (score2 > score1) {
      team2Stats.wins += 1;
      team1Stats.losses += 1;
    }
    // Note: Ties don't count as wins or losses
  });

  // Convert map to array of standings
  const standings: TeamStanding[] = Array.from(teamStats.entries()).map(([team, stats]) => {
    const gamesPlayed = stats.wins + stats.losses;
    const pointDifferential = stats.pointsFor - stats.pointsAgainst;
    const avgPointDifferential = gamesPlayed > 0 ? pointDifferential / gamesPlayed : 0;

    return {
      team,
      wins: stats.wins,
      losses: stats.losses,
      gamesPlayed,
      pointsFor: stats.pointsFor,
      pointsAgainst: stats.pointsAgainst,
      pointDifferential,
      avgPointDifferential,
    };
  });

  // Sort by wins (descending), then by avg point differential (descending)
  standings.sort((a, b) => {
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }
    return b.avgPointDifferential - a.avgPointDifferential;
  });

  return standings;
}

