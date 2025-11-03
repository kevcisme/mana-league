import { readCSVFile, parseCSVContent } from './csv-utils-server';

export interface Game {
  id: number;
  gameID?: string; // Optional for backward compatibility
  date: string;
  time: string;
  team1: string;
  team2: string;
  location: string;
  status: string;
}

// Default schedule data (fallback if no uploaded data exists)
const defaultScheduleData = [
  { gameID: "4", date: "10/11/25", team1: "BIG TIME", team2: "MANA HAWAII", time: "5:30" },
  { gameID: "5", date: "10/11/25", team1: "MANAFEST", team2: "LOCKDOWN", time: "6:10" },
  { gameID: "6", date: "10/11/25", team1: "BIG TIME", team2: "RAINJAHZ", time: "6:50" },
  { gameID: "7", date: "10/11/25", team1: "JAMMERS", team2: "SHARKS", time: "7:30" },
  { gameID: "8", date: "10/18/25", team1: "LOCKDOWN", team2: "BIG TIME", time: "6:10" },
  { gameID: "9", date: "10/18/25", team1: "MANAFEST", team2: "SHARKS", time: "6:50" },
  { gameID: "10", date: "10/18/25", team1: "RAINJAHZ", team2: "JAMMERS", time: "7:30" },
  { gameID: "15", date: "10/25/25", team1: "LOCKDOWN", team2: "SHARKS", time: "5:30" },
  { gameID: "16", date: "10/25/25", team1: "RAINJAHZ", team2: "MANA HAWAII", time: "6:10" },
  { gameID: "17", date: "10/25/25", team1: "MANAFEST", team2: "JAMMERS", time: "6:50" },
  { gameID: "11", date: "11/1/25", team1: "LOCKDOWN", team2: "MANA HAWAII", time: "5:30" },
  { gameID: "12", date: "11/1/25", team1: "SHARKS", team2: "MANA HAWAII", time: "6:10" },
  { gameID: "13", date: "11/1/25", team1: "MANAFEST", team2: "RAINJAHZ", time: "6:50" },
  { gameID: "14", date: "11/1/25", team1: "BIG TIME", team2: "JAMMERS", time: "7:30" },
  { gameID: "19", date: "11/8/25", team1: "SHARKS", team2: "BIG TIME", time: "6:10" },
  { gameID: "20", date: "11/8/25", team1: "JAMMERS", team2: "MANA HAWAII", time: "6:50" },
  { gameID: "21", date: "11/8/25", team1: "LOCKDOWN", team2: "RAINJAHZ", time: "7:30" },
  { date: "11/11/25", team1: "1ST SEED", team2: "4TH SEED", time: "6:10", isPlayoff: true },
  { date: "11/11/25", team1: "2ND SEED", team2: "3RD SEED", time: "6:50", isPlayoff: true },
  { date: "11/11/25", team1: "6TH SEED", team2: "7TH SEED", time: "7:30", isPlayoff: true },
  { date: "11/22/25", team1: "WINNER GM 21", team2: "5TH SEED", time: "6:50", isPlayoff: true },
  { date: "11/22/25", team1: "LOSER GM 19", team2: "LOSER GM 20", time: "7:30", isPlayoff: true },
  { date: "11/22/25", team1: "WINNER GM 19", team2: "WINNER GM 20", time: "8:10", isPlayoff: true },
];

/**
 * Parse schedule CSV content
 */
function parseScheduleCSV(csvContent: string) {
  const rows = parseCSVContent(csvContent);
  const scheduleData = [];
  
  for (const row of rows) {
    const gameID = row['gameID'] || row['GameID'] || row['game_id'] || row['Game ID'];
    const date = row['Date'] || row['date'];
    const team1 = row['Team 1'] || row['Team1'] || row['team1'] || row['team_1'];
    const team2 = row['Team 2'] || row['Team2'] || row['team2'] || row['team_2'];
    const time = row['Time'] || row['time'];
    
    // Skip if essential data is missing or if it's a "No Game" entry
    if (!date || !team1 || !team2 || !time) continue;
    if (team1 === 'No Game' || team2 === 'No Game') continue;
    
    // Determine if it's a playoff game
    const isPlayoff = team1.includes('SEED') || team2.includes('SEED') || 
                      team1.includes('WINNER') || team2.includes('WINNER') ||
                      team1.includes('LOSER') || team2.includes('LOSER');
    
    scheduleData.push({
      gameID,
      date,
      team1,
      team2,
      time,
      isPlayoff
    });
  }
  
  return scheduleData;
}

/**
 * Convert raw schedule data to Game objects
 */
async function parseScheduleData(): Promise<Game[]> {
  const games: Game[] = [];
  
  // Try to read from server file first
  let dataSource = defaultScheduleData;
  try {
    const csvContent = await readCSVFile('schedule.csv');
    if (csvContent) {
      const parsedData = parseScheduleCSV(csvContent);
      if (parsedData.length > 0) {
        dataSource = parsedData;
      }
    }
  } catch (error) {
    console.log('Using default schedule data');
  }
  
  dataSource.forEach((data: any, index: number) => {
    // Convert date from MM/DD/YY to YYYY-MM-DD
    const [month, day, year] = data.date.split('/');
    const fullYear = `20${year}`;
    const isoDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    // Convert time from H:MM to HH:MM 24-hour format (PM times)
    const [hours, minutes] = data.time.split(':');
    let hour24 = parseInt(hours);
    // Add 12 hours if it's PM time (after 5:30 is PM)
    if (hour24 < 12 && hour24 >= 5) {
      hour24 += 12;
    }
    const timeFormatted = `${hour24.toString().padStart(2, '0')}:${minutes}`;
    
    // Determine status based on date (using local timezone to avoid date shift issues)
    const gameDate = new Date(parseInt(fullYear), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let status = "scheduled";
    if (gameDate < today) {
      status = "completed";
    } else if (gameDate.toDateString() === today.toDateString()) {
      status = "today";
    }
    
    if (data.isPlayoff) {
      status = "playoff";
    }
    
    games.push({
      id: index + 1,
      gameID: data.gameID, // Include gameID from CSV
      date: isoDate,
      time: timeFormatted,
      team1: data.team1,
      team2: data.team2,
      location: "Manoa Basketball Gym",
      status
    });
  });
  
  return games;
}

/**
 * Get the current schedule games (checks server for updates)
 */
export async function getScheduleGames(): Promise<Game[]> {
  return await parseScheduleData();
}

// Export a static version for initial load (with default data)
function parseDefaultScheduleData(): Game[] {
  const games: Game[] = [];
  
  defaultScheduleData.forEach((data: any, index: number) => {
    // Convert date from MM/DD/YY to YYYY-MM-DD
    const [month, day, year] = data.date.split('/');
    const fullYear = `20${year}`;
    const isoDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    // Convert time from H:MM to HH:MM 24-hour format (PM times)
    const [hours, minutes] = data.time.split(':');
    let hour24 = parseInt(hours);
    // Add 12 hours if it's PM time (after 5:30 is PM)
    if (hour24 < 12 && hour24 >= 5) {
      hour24 += 12;
    }
    const timeFormatted = `${hour24.toString().padStart(2, '0')}:${minutes}`;
    
    // Determine status based on date (using local timezone to avoid date shift issues)
    const gameDate = new Date(parseInt(fullYear), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let status = "scheduled";
    if (gameDate < today) {
      status = "completed";
    } else if (gameDate.toDateString() === today.toDateString()) {
      status = "today";
    }
    
    if (data.isPlayoff) {
      status = "playoff";
    }
    
    games.push({
      id: index + 1,
      gameID: data.gameID,
      date: isoDate,
      time: timeFormatted,
      team1: data.team1,
      team2: data.team2,
      location: "Manoa Basketball Gym",
      status
    });
  });
  
  return games;
}

export const scheduleGames = parseDefaultScheduleData();

/**
 * Get unique list of teams from the schedule
 */
export function getTeams(): string[] {
  const teamSet = new Set<string>();
  
  scheduleGames.forEach(game => {
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
