import { NextRequest, NextResponse } from 'next/server';
import { readCSVFile, writeCSVFile, parseCSVContent, arrayToCSV } from '@/lib/csv-utils-server';

const RECAPS_FILE = 'recaps.csv';
const HEADERS = [
  'id',
  'gameId', 
  'date',
  'time',
  'team1',
  'team2',
  'score1',
  'score2',
  'location',
  'highlights',
  'playerOfTheMatch',
  'attendance',
  'weather',
  'recap'
];

/**
 * GET /api/recaps - Get all recaps
 */
export async function GET() {
  try {
    const content = await readCSVFile(RECAPS_FILE);
    
    if (!content) {
      // Return empty array if file doesn't exist yet
      return NextResponse.json({ recaps: [], success: true });
    }
    
    const recapsData = parseCSVContent(content);
    
    // Parse the highlights field (stored as pipe-separated)
    const recaps = recapsData.map(recap => ({
      ...recap,
      id: parseInt(recap.id) || 0,
      gameId: parseInt(recap.gameId) || 0,
      score1: parseInt(recap.score1) || 0,
      score2: parseInt(recap.score2) || 0,
      attendance: parseInt(recap.attendance) || 0,
      highlights: recap.highlights ? recap.highlights.split('|') : [],
    }));
    
    return NextResponse.json({ recaps, success: true });
  } catch (error) {
    console.error('Error reading recaps:', error);
    return NextResponse.json({ error: 'Failed to read recaps' }, { status: 500 });
  }
}

/**
 * POST /api/recaps - Add or update a recap
 */
export async function POST(request: NextRequest) {
  try {
    const recap = await request.json();
    
    if (!recap || !recap.gameId) {
      return NextResponse.json({ error: 'Invalid recap data' }, { status: 400 });
    }
    
    // Read existing recaps
    const existingContent = await readCSVFile(RECAPS_FILE);
    const existingRecaps = existingContent ? parseCSVContent(existingContent) : [];
    
    // Convert highlights array to pipe-separated string
    const recapToSave = {
      ...recap,
      highlights: Array.isArray(recap.highlights) ? recap.highlights.join('|') : recap.highlights,
    };
    
    // Find if this recap already exists
    const existingIndex = existingRecaps.findIndex(r => 
      parseInt(r.gameId) === parseInt(recap.gameId)
    );
    
    if (existingIndex >= 0) {
      // Update existing
      existingRecaps[existingIndex] = recapToSave;
    } else {
      // Add new
      existingRecaps.push(recapToSave);
    }
    
    // Convert back to CSV
    const csvContent = arrayToCSV(existingRecaps, HEADERS);
    
    // Write to file
    const success = await writeCSVFile(RECAPS_FILE, csvContent);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to write recaps file' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Recap saved successfully'
    });
  } catch (error) {
    console.error('Error saving recap:', error);
    return NextResponse.json({ error: 'Failed to save recap' }, { status: 500 });
  }
}

/**
 * DELETE /api/recaps - Delete a recap
 */
export async function DELETE(request: NextRequest) {
  try {
    const { gameId } = await request.json();
    
    if (!gameId) {
      return NextResponse.json({ error: 'gameId is required' }, { status: 400 });
    }
    
    // Read existing recaps
    const existingContent = await readCSVFile(RECAPS_FILE);
    
    if (!existingContent) {
      return NextResponse.json({ error: 'No recaps found' }, { status: 404 });
    }
    
    const existingRecaps = parseCSVContent(existingContent);
    
    // Filter out the recap to delete
    const filteredRecaps = existingRecaps.filter(r => 
      parseInt(r.gameId) !== parseInt(gameId)
    );
    
    // Convert back to CSV
    const csvContent = arrayToCSV(filteredRecaps, HEADERS);
    
    // Write to file
    const success = await writeCSVFile(RECAPS_FILE, csvContent);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete recap' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Recap deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting recap:', error);
    return NextResponse.json({ error: 'Failed to delete recap' }, { status: 500 });
  }
}

