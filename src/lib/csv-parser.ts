/**
 * Parse CSV content into an array of objects
 */
export function parseCSV(csvContent: string): Record<string, string>[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length === 0) return [];
  
  // Get headers from first line
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Parse data rows
  const data: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = line.split(',').map(v => v.trim());
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    // Skip rows with all empty values or "No Game" entries
    const hasData = Object.values(row).some(v => v && v !== 'No Game');
    if (hasData) {
      data.push(row);
    }
  }
  
  return data;
}

/**
 * Parse schedule CSV and convert to game format
 */
export function parseScheduleCSV(csvContent: string) {
  const rows = parseCSV(csvContent);
  const games = [];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
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
    
    games.push({
      gameID,
      date,
      team1,
      team2,
      time,
      isPlayoff
    });
  }
  
  return games;
}

/**
 * Save schedule data to server via API
 */
export async function saveScheduleToStorage(csvContent: string): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const games = parseScheduleCSV(csvContent);
    
    if (games.length === 0) {
      return { success: false, count: 0, error: 'No valid games found in CSV' };
    }
    
    // Save to server via API
    const { saveSchedules } = await import('./api-client');
    const result = await saveSchedules(csvContent);
    
    if (!result.success) {
      return { success: false, count: 0, error: result.error };
    }
    
    return { success: true, count: games.length };
  } catch (error) {
    return { 
      success: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Failed to parse CSV' 
    };
  }
}

/**
 * Get schedule data from server via API
 */
export async function getScheduleFromStorage() {
  try {
    const { fetchSchedules } = await import('./api-client');
    const content = await fetchSchedules();
    
    if (!content) return null;
    
    const games = parseScheduleCSV(content);
    return games;
  } catch {
    return null;
  }
}

/**
 * Clear schedule data (no-op for server-side storage)
 */
export function clearScheduleFromStorage() {
  // No-op: Can't delete server files from client
  // Could implement an API endpoint for this if needed
  console.warn('clearScheduleFromStorage is not supported with server-side storage');
}

/**
 * Parse game scores CSV
 */
export function parseScoresCSV(csvContent: string) {
  const rows = parseCSV(csvContent);
  const scores = [];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const gameID = row['gameID'] || row['GameID'] || row['game_id'] || row['Game ID'];
    const date = row['Date'] || row['date'];
    const team1 = row['Team 1'] || row['Team1'] || row['team1'] || row['team_1'];
    const team2 = row['Team 2'] || row['Team2'] || row['team2'] || row['team_2'];
    const score1 = row['Score 1'] || row['Score1'] || row['score1'] || row['score_1'];
    const score2 = row['Score 2'] || row['Score2'] || row['score2'] || row['score_2'];
    
    // Skip if essential data is missing (gameID is now required)
    if (!gameID || !date || !team1 || !team2 || score1 === undefined || score2 === undefined) continue;
    
    scores.push({
      gameID,
      date,
      team1,
      team2,
      score1: parseInt(score1) || 0,
      score2: parseInt(score2) || 0,
    });
  }
  
  return scores;
}

/**
 * Save scores data to server via API
 */
export async function saveScoresToStorage(csvContent: string): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const scores = parseScoresCSV(csvContent);
    
    if (scores.length === 0) {
      return { success: false, count: 0, error: 'No valid scores found in CSV. Make sure gameID column is included.' };
    }
    
    // Save to server via API
    const { saveScores } = await import('./api-client');
    const result = await saveScores(csvContent);
    
    if (!result.success) {
      return { success: false, count: 0, error: result.error };
    }
    
    return { success: true, count: result.count || scores.length };
  } catch (error) {
    return { 
      success: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Failed to parse CSV' 
    };
  }
}

/**
 * Get scores data from server via API
 */
export async function getScoresFromStorage() {
  try {
    const { fetchScores } = await import('./api-client');
    const scores = await fetchScores();
    return scores.length > 0 ? scores : null;
  } catch {
    return null;
  }
}

/**
 * Clear scores data (no-op for server-side storage)
 */
export function clearScoresFromStorage() {
  // No-op: Can't delete server files from client
  console.warn('clearScoresFromStorage is not supported with server-side storage');
}

