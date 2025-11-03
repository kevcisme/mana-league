/**
 * Client-side API utilities for interacting with CSV data
 */

/**
 * Fetch schedules from server
 */
export async function fetchSchedules(): Promise<string | null> {
  try {
    const response = await fetch('/api/schedules');
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      console.error('Failed to fetch schedules:', data.error);
      return null;
    }
    
    return data.content;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return null;
  }
}

/**
 * Save schedules to server
 */
export async function saveSchedules(csvContent: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: csvContent }),
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to save schedules' };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Fetch scores from server
 */
export async function fetchScores(): Promise<any[]> {
  try {
    const response = await fetch('/api/scores');
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      console.error('Failed to fetch scores:', data.error);
      return [];
    }
    
    return data.scores || [];
  } catch (error) {
    console.error('Error fetching scores:', error);
    return [];
  }
}

/**
 * Save scores to server
 */
export async function saveScores(csvContent: string): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: csvContent }),
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to save scores' };
    }
    
    return { success: true, count: data.count };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Fetch recaps from server
 */
export async function fetchRecaps(): Promise<any[]> {
  try {
    const response = await fetch('/api/recaps', {
      cache: 'no-store', // Don't cache recaps
    });
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      console.error('Failed to fetch recaps:', data.error);
      return [];
    }
    
    return data.recaps || [];
  } catch (error) {
    console.error('Error fetching recaps:', error);
    return [];
  }
}

/**
 * Save recap to server
 */
export async function saveRecap(recap: any): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/recaps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recap),
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to save recap' };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Delete recap from server
 */
export async function deleteRecap(gameId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/recaps', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId }),
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to delete recap' };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

