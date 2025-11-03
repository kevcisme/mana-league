import { importSchedulesFromCSV, importScoresFromCSV } from './supabase-data';

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
 * Save schedule data to Supabase
 */
export async function saveScheduleToStorage(csvContent: string): Promise<{ success: boolean; count: number; error?: string }> {
  return await importSchedulesFromCSV(csvContent);
}

/**
 * Save scores data to Supabase
 */
export async function saveScoresToStorage(csvContent: string): Promise<{ success: boolean; count: number; error?: string }> {
  return await importScoresFromCSV(csvContent);
}

// Legacy functions for compatibility
export function getScheduleFromStorage() {
  console.warn('getScheduleFromStorage is deprecated - use getScheduleGames from schedule-data-supabase instead');
  return null;
}

export function clearScheduleFromStorage() {
  console.warn('clearScheduleFromStorage is not implemented for Supabase');
}

export function getScoresFromStorage() {
  console.warn('getScoresFromStorage is deprecated - use getAllScores from scores-data-supabase instead');
  return null;
}

export function clearScoresFromStorage() {
  console.warn('clearScoresFromStorage is not implemented for Supabase');
}

