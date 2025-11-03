import { NextRequest, NextResponse } from 'next/server';
import { readCSVFile, writeCSVFile, parseCSVContent, arrayToCSV } from '@/lib/csv-utils-server';

const SCORES_FILE = 'scores.csv';
const HEADERS = ['gameID', 'Date', 'Team 1', 'Team 2', 'Score 1', 'Score 2'];

/**
 * GET /api/scores - Get all scores
 */
export async function GET() {
  try {
    const content = await readCSVFile(SCORES_FILE);
    
    if (!content) {
      // Return empty array if file doesn't exist yet
      return NextResponse.json({ scores: [], success: true });
    }
    
    const rawScores = parseCSVContent(content);
    
    // Convert scores to proper format with numbers
    const scores = rawScores.map(row => ({
      gameID: row['gameID'] || row['GameID'] || row['game_id'] || row['Game ID'],
      date: row['Date'] || row['date'],
      team1: row['Team 1'] || row['Team1'] || row['team1'] || row['team_1'],
      team2: row['Team 2'] || row['Team2'] || row['team2'] || row['team_2'],
      score1: parseInt(row['Score 1'] || row['Score1'] || row['score1'] || row['score_1'] || '0'),
      score2: parseInt(row['Score 2'] || row['Score2'] || row['score2'] || row['score_2'] || '0'),
    }));
    
    return NextResponse.json({ scores, success: true });
  } catch (error) {
    console.error('Error reading scores:', error);
    return NextResponse.json({ error: 'Failed to read scores' }, { status: 500 });
  }
}

/**
 * POST /api/scores - Add or update scores
 */
export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Invalid CSV content' }, { status: 400 });
    }
    
    // Parse the new scores
    const newScores = parseCSVContent(content);
    
    if (newScores.length === 0) {
      return NextResponse.json({ error: 'No valid scores found in CSV' }, { status: 400 });
    }
    
    // Read existing scores
    const existingContent = await readCSVFile(SCORES_FILE);
    const existingScores = existingContent ? parseCSVContent(existingContent) : [];
    
    // Merge scores (use Map to avoid duplicates based on gameID)
    const scoresMap = new Map();
    
    // Add existing scores
    existingScores.forEach(score => {
      const gameID = score['gameID'] || score['GameID'] || score['game_id'] || score['Game ID'];
      if (gameID) {
        scoresMap.set(gameID, score);
      }
    });
    
    // Add/update with new scores
    newScores.forEach(score => {
      const gameID = score['gameID'] || score['GameID'] || score['game_id'] || score['Game ID'];
      if (gameID) {
        scoresMap.set(gameID, score);
      }
    });
    
    const allScores = Array.from(scoresMap.values());
    
    // Convert back to CSV
    const csvContent = arrayToCSV(allScores, HEADERS);
    
    // Write to file
    const success = await writeCSVFile(SCORES_FILE, csvContent);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to write scores file' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Scores updated successfully',
      count: newScores.length 
    });
  } catch (error) {
    console.error('Error updating scores:', error);
    return NextResponse.json({ error: 'Failed to update scores' }, { status: 500 });
  }
}

