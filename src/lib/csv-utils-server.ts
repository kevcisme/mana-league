import 'server-only';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'assets', 'data');

/**
 * Ensure data directory exists
 */
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Read CSV file from server
 */
export async function readCSVFile(filename: string): Promise<string | null> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

/**
 * Write CSV file to server
 */
export async function writeCSVFile(filename: string, content: string): Promise<boolean> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

/**
 * Parse CSV content into array of objects
 */
export function parseCSVContent(csvContent: string): Record<string, string>[] {
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
 * Convert array of objects to CSV string
 */
export function arrayToCSV(data: Record<string, any>[], headers: string[]): string {
  if (data.length === 0) {
    return headers.join(',') + '\n';
  }
  
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] ?? '';
      // Escape values with commas
      if (String(value).includes(',')) {
        return `"${value}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

