import { NextRequest, NextResponse } from 'next/server';
import { readCSVFile, writeCSVFile } from '@/lib/csv-utils-server';

const SCHEDULE_FILE = 'schedule.csv';

/**
 * GET /api/schedules - Get all schedules
 */
export async function GET() {
  try {
    const content = await readCSVFile(SCHEDULE_FILE);
    
    if (!content) {
      return NextResponse.json({ error: 'Schedule file not found' }, { status: 404 });
    }
    
    return NextResponse.json({ content, success: true });
  } catch (error) {
    console.error('Error reading schedules:', error);
    return NextResponse.json({ error: 'Failed to read schedules' }, { status: 500 });
  }
}

/**
 * POST /api/schedules - Update schedules
 */
export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Invalid CSV content' }, { status: 400 });
    }
    
    const success = await writeCSVFile(SCHEDULE_FILE, content);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to write schedule file' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Schedule updated successfully' });
  } catch (error) {
    console.error('Error updating schedules:', error);
    return NextResponse.json({ error: 'Failed to update schedules' }, { status: 500 });
  }
}

