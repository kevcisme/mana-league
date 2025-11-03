# Game Recap Feature Guide

## Overview
The game recap feature has been fully implemented and is now functional! You can now:
1. Generate recaps from uploaded game scores
2. View real data on the recaps page instead of mock data
3. Create custom recaps with highlights, player of the match, attendance, and more

## What Was Changed

### New Files Created
- **`src/lib/recaps-data.ts`**: New data layer for managing game recaps
  - Functions to save/load recaps from localStorage
  - Auto-generation of basic recaps from scored games
  - Merges custom recaps with auto-generated ones

- **`src/assets/data/scores.csv`**: Sample scores CSV file with test data
  - Contains 5 game scores ready to be uploaded

### Updated Files
- **`src/app/admin/page.tsx`**: Made the "Generate Recaps" tab fully functional
  - Added recap generation dialog with form
  - Auto-generate all recaps with one click
  - Edit existing custom recaps
  - Shows games with scores available for recap creation

- **`src/app/recaps/page.tsx`**: Replaced all mock data with real data
  - Now pulls from actual uploaded scores
  - Shows auto-generated recaps for games with scores
  - Shows custom recaps that have been saved
  - Dynamically loads teams from schedule

## How to Use

### Step 1: Upload Schedule (if not already done)
1. Go to `/admin` page (login with password: `mana2025`)
2. Navigate to "Data Upload" tab
3. Upload the schedule CSV (or use the existing one at `src/assets/data/schedule.csv`)

### Step 2: Upload Scores
1. Still on the admin page, "Data Upload" tab
2. Find the "Upload Game Scores" card
3. Upload a CSV file with this format:
   ```csv
   gameID,Date,Team 1,Team 2,Score 1,Score 2
   4,10/11/25,BIG TIME,MANA HAWAII,85,72
   5,10/11/25,MANAFEST,LOCKDOWN,91,88
   ```
4. **Note**: The `gameID` must match the gameID from your schedule CSV
5. A sample scores file is available at `src/assets/data/scores.csv`

### Step 3: Generate Recaps
1. Go to the "Generate Recaps" tab in the admin page
2. You'll see a list of all games with scores
3. Options:
   - **Auto-Generate All Recaps**: Click this button to automatically create basic recaps for all scored games
   - **Create/Edit Individual Recap**: Click "Create Recap" or "Edit Recap" on any game to customize:
     - Highlights (one per line)
     - Player of the Match
     - Attendance
     - Weather conditions
     - Full recap text (optional)

### Step 4: View Recaps
1. Navigate to `/recaps` page
2. You'll now see real game recaps instead of mock data
3. Features:
   - Filter by team
   - Search by team or player name
   - See full game details, highlights, and stats
   - Summary statistics at the bottom

## Data Storage
- All data is stored in browser localStorage
- Data persists between page reloads
- Keys used:
  - `mana-league-schedule`: Schedule data
  - `mana-league-scores`: Game scores
  - `mana-league-recaps`: Custom game recaps

## Recap Logic
1. **Auto-Generated Recaps**: Created automatically for any game that has a score but no custom recap
   - Includes basic highlights based on score
   - Generic player of the match
   - Default attendance and weather

2. **Custom Recaps**: When you create/edit a recap in admin, it saves as a custom recap
   - Overrides the auto-generated version
   - Fully customizable
   - Persists in localStorage

## CSV Template Downloads
Both templates are available in the admin panel:
- **Schedule Template**: Download from "Upload Schedule" card
- **Scores Template**: Download from "Upload Game Scores" card

## Testing
A sample scores file has been created at `src/assets/data/scores.csv` with 5 games worth of data that you can upload immediately to test the feature.

## Tips
- Make sure gameIDs in your scores CSV match the gameIDs in your schedule
- You can upload scores multiple times - new scores will merge with existing ones
- Custom recaps can be edited at any time
- The recaps page will show auto-generated recaps even without creating custom ones

## Future Enhancements (Optional)
- Add photos to recaps
- Include detailed game stats (possession, shots, etc.)
- Export recaps as PDFs
- Add more detailed player statistics
- Integration with a backend database instead of localStorage

