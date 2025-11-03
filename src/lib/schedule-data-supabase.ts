import { getAllSchedules } from './supabase-data';

export interface Game {
  id: number;
  gameID?: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  location: string;
  status: string;
}

/**
 * Convert Supabase schedule to Game format
 */
function scheduleToGame(schedule: any, index: number): Game {
  // Convert date from MM/DD/YY to YYYY-MM-DD
  const [month, day, year] = schedule.date.split('/');
  const fullYear = year.length === 2 ? `20${year}` : year;
  const isoDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  // Convert time from H:MM to HH:MM 24-hour format
  const [hours, minutes] = schedule.time.split(':');
  let hour24 = parseInt(hours);
  if (hour24 < 12 && hour24 >= 5) {
    hour24 += 12;
  }
  const timeFormatted = `${hour24.toString().padStart(2, '0')}:${minutes}`;
  
  // Determine status based on date
  const gameDate = new Date(parseInt(fullYear), parseInt(month) - 1, parseInt(day));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let status = "scheduled";
  if (gameDate < today) {
    status = "completed";
  } else if (gameDate.toDateString() === today.toDateString()) {
    status = "today";
  }
  
  if (schedule.is_playoff) {
    status = "playoff";
  }
  
  return {
    id: schedule.id || index + 1,
    gameID: schedule.game_id,
    date: isoDate,
    time: timeFormatted,
    team1: schedule.team1,
    team2: schedule.team2,
    location: schedule.location || "Manoa Basketball Gym",
    status
  };
}

/**
 * Get all schedule games from Supabase
 */
export async function getScheduleGames(): Promise<Game[]> {
  const schedules = await getAllSchedules();
  return schedules.map((schedule, index) => scheduleToGame(schedule, index));
}

/**
 * Get unique list of teams from the schedule
 */
export async function getTeams(): Promise<string[]> {
  const games = await getScheduleGames();
  const teamSet = new Set<string>();
  
  games.forEach(game => {
    // Only add teams that aren't playoff placeholders
    if (!game.team1.includes("SEED") && !game.team1.includes("WINNER") && !game.team1.includes("LOSER") && !game.team1.includes("GM")) {
      teamSet.add(game.team1);
    }
    if (!game.team2.includes("SEED") && !game.team2.includes("WINNER") && !game.team2.includes("LOSER") && !game.team2.includes("GM")) {
      teamSet.add(game.team2);
    }
  });
  
  return ["All Teams", ...Array.from(teamSet).sort()];
}

// Export a synchronous version that uses default data (for backwards compatibility)
export function getTeamsSync(): string[] {
  return [
    "All Teams",
    "BIG TIME",
    "MANAFEST",
    "LOCKDOWN",
    "RAINJAHZ",
    "JAMMERS",
    "SHARKS",
    "MANA HAWAII"
  ];
}

