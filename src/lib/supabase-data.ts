import { supabase, Schedule, Score, Recap } from './supabase';

/**
 * SCHEDULES
 */

export async function getAllSchedules(): Promise<Schedule[]> {
  console.log('📅 Fetching schedules from Supabase...');
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) {
    console.error('❌ Error fetching schedules:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return [];
  }
  
  console.log('✅ Schedules fetched:', data?.length || 0);
  return data || [];
}

export async function upsertSchedules(schedules: Schedule[]): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('schedules')
    .upsert(schedules, { onConflict: 'game_id' });
  
  if (error) {
    console.error('Error upserting schedules:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * SCORES
 */

export async function getAllScores(): Promise<Score[]> {
  console.log('🏀 Fetching scores from Supabase...');
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('❌ Error fetching scores:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return [];
  }
  
  console.log('✅ Scores fetched:', data?.length || 0);
  return data || [];
}

export async function getScoreByGameId(gameId: string): Promise<Score | null> {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('game_id', gameId)
    .single();
  
  if (error) {
    console.error('Error fetching score:', error);
    return null;
  }
  
  return data;
}

export async function upsertScores(scores: Score[]): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('scores')
    .upsert(scores, { onConflict: 'game_id' });
  
  if (error) {
    console.error('Error upserting scores:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * RECAPS
 */

export async function getAllRecaps(): Promise<Recap[]> {
  const { data, error } = await supabase
    .from('recaps')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching recaps:', error);
    return [];
  }
  
  return data || [];
}

export async function getRecapByGameId(gameId: string): Promise<Recap | null> {
  const { data, error } = await supabase
    .from('recaps')
    .select('*')
    .eq('game_id', gameId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - this is fine
      return null;
    }
    console.error('Error fetching recap:', error);
    return null;
  }
  
  return data;
}

export async function upsertRecap(recap: Recap): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('recaps')
    .upsert(recap, { onConflict: 'game_id' });
  
  if (error) {
    console.error('Error upserting recap:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

export async function deleteRecap(gameId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('recaps')
    .delete()
    .eq('game_id', gameId);
  
  if (error) {
    console.error('Error deleting recap:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * CSV IMPORT HELPERS
 */

export async function importSchedulesFromCSV(csvContent: string): Promise<{ success: boolean; count: number; error?: string }> {
  // Parse CSV content
  const lines = csvContent.trim().split('\n');
  if (lines.length <= 1) {
    return { success: false, count: 0, error: 'CSV file is empty' };
  }
  
  const headers = lines[0].split(',').map(h => h.trim());
  const schedules: Schedule[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    const gameId = row['gameID'] || row['GameID'] || row['game_id'];
    const date = row['Date'] || row['date'];
    const team1 = row['Team 1'] || row['Team1'] || row['team1'];
    const team2 = row['Team 2'] || row['Team2'] || row['team2'];
    const time = row['Time'] || row['time'];
    
    if (!date || !team1 || !team2 || !time) continue;
    if (team1 === 'No Game' || team2 === 'No Game') continue;
    if (!gameId) continue; // Skip rows without gameID
    
    const isPlayoff = team1.includes('SEED') || team2.includes('SEED') || 
                      team1.includes('WINNER') || team2.includes('WINNER') ||
                      team1.includes('LOSER') || team2.includes('LOSER');
    
    schedules.push({
      game_id: gameId,
      date,
      team1,
      team2,
      time,
      location: 'Manoa Basketball Gym',
      is_playoff: isPlayoff
    });
  }
  
  if (schedules.length === 0) {
    return { success: false, count: 0, error: 'No valid schedules found in CSV' };
  }
  
  const result = await upsertSchedules(schedules);
  return { ...result, count: schedules.length };
}

export async function importScoresFromCSV(csvContent: string): Promise<{ success: boolean; count: number; error?: string }> {
  // Parse CSV content
  const lines = csvContent.trim().split('\n');
  if (lines.length <= 1) {
    return { success: false, count: 0, error: 'CSV file is empty' };
  }
  
  const headers = lines[0].split(',').map(h => h.trim());
  const scores: Score[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    const gameId = row['gameID'] || row['GameID'] || row['game_id'];
    const date = row['Date'] || row['date'];
    const team1 = row['Team 1'] || row['Team1'] || row['team1'];
    const team2 = row['Team 2'] || row['Team2'] || row['team2'];
    const score1 = row['Score 1'] || row['Score1'] || row['score1'];
    const score2 = row['Score 2'] || row['Score2'] || row['score2'];
    
    if (!gameId || !date || !team1 || !team2 || !score1 || !score2) continue;
    
    scores.push({
      game_id: gameId,
      date,
      team1,
      team2,
      score1: parseInt(score1) || 0,
      score2: parseInt(score2) || 0
    });
  }
  
  if (scores.length === 0) {
    return { success: false, count: 0, error: 'No valid scores found in CSV' };
  }
  
  // Get existing schedules to validate game IDs
  const existingSchedules = await getAllSchedules();
  const existingGameIds = new Set(existingSchedules.map(s => s.game_id));
  
  // Check if all score game IDs exist in schedules
  const missingGameIds = scores.filter(s => !existingGameIds.has(s.game_id)).map(s => s.game_id);
  
  if (missingGameIds.length > 0) {
    return { 
      success: false, 
      count: 0, 
      error: `Game IDs not found in schedule: ${missingGameIds.join(', ')}. Please upload the schedule first.` 
    };
  }
  
  const result = await upsertScores(scores);
  return { ...result, count: scores.length };
}

