# Supabase Setup Guide

## Step 1: Create Environment Variables

Create a file named `.env.local` in the root of your project with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zyjaciriexhrzxzvwajy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5amFjaXJpZXhocnp4enZ3YWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMjk2NzcsImV4cCI6MjA3NzcwNTY3N30.N_en2Ah8KtxkzNWWZEMxU4_PZbhimZhCom0dpjgHkLk
```

## Step 2: Run Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/zyjaciriexhrzxzvwajy
2. Click **SQL Editor** in the left sidebar
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL Editor and click **Run**

This will create:
- `schedules` table - stores game schedule
- `scores` table - stores game scores
- `recaps` table - stores custom game recaps

## Step 3: Update Your Code Imports

Replace the old imports with new Supabase ones in these files:

### `src/app/page.tsx`
```typescript
// OLD
import { getScheduleGames } from "@/lib/schedule-data";
import { getAllScores } from "@/lib/scores-data";

// NEW
import { getScheduleGames } from "@/lib/schedule-data-supabase";
import { getAllScores } from "@/lib/scores-data-supabase";
```

### `src/app/schedule/page.tsx`
```typescript
// OLD
import { getScheduleGames, getTeams } from "@/lib/schedule-data";

// NEW  
import { getScheduleGames, getTeamsSync as getTeams } from "@/lib/schedule-data-supabase";
```

### `src/app/recaps/page.tsx`
```typescript
// OLD
import { getAllRecaps } from "@/lib/recaps-data";
import { getTeams } from "@/lib/schedule-data";

// NEW
import { getAllRecaps } from "@/lib/recaps-data-supabase";
import { getTeamsSync as getTeams } from "@/lib/schedule-data-supabase";
```

### `src/app/admin/page.tsx`
```typescript
// OLD
import { saveScheduleToStorage, saveScoresToStorage } from "@/lib/csv-parser";
import { getScheduleGames } from "@/lib/schedule-data";
import { getAllScores } from "@/lib/scores-data";
import { getGamesWithScores, generateBasicRecap, saveRecapToStorage, getRecapsFromStorage, getAllRecaps } from "@/lib/recaps-data";

// NEW
import { saveScheduleToStorage, saveScoresToStorage } from "@/lib/csv-parser-supabase";
import { getScheduleGames } from "@/lib/schedule-data-supabase";
import { getAllScores } from "@/lib/scores-data-supabase";
import { getGamesWithScores, generateBasicRecap, saveRecapToStorage, getRecapsFromStorage, getAllRecaps } from "@/lib/recaps-data-supabase";
```

## Step 4: Import Existing CSV Data

After running the schema, you can import your existing CSV data:

1. Restart your dev server: `npm run dev`
2. Go to `/admin` page
3. Upload your `schedule.csv` file
4. Upload your `scores.csv` file
5. The data will be imported into Supabase automatically!

## Step 5: Verify Data

Check your Supabase dashboard:
1. Go to **Table Editor** tab
2. You should see your `schedules`, `scores`, and `recaps` tables
3. Click on each table to view the data

## Features

### Automatic Benefits:
✅ **Real-time data** - All devices see the same data instantly  
✅ **Persistent storage** - Never lose data again  
✅ **Backup included** - Supabase handles backups  
✅ **Scalable** - Handle thousands of games  
✅ **Fast queries** - Indexed for performance  
✅ **Row Level Security** - Data is secure  

### Data Management:
- **Schedules**: Upserted by `game_id` (no duplicates)
- **Scores**: Upserted by `game_id` (updates existing scores)
- **Recaps**: Upserted by `game_id` (one recap per game)

### Foreign Keys:
- Scores and Recaps link to Schedules via `game_id`
- Deleting a schedule cascades to scores and recaps

## Troubleshooting

**Error: Missing Supabase environment variables**
- Make sure `.env.local` exists and has the correct values
- Restart your dev server after creating `.env.local`

**Error: relation "schedules" does not exist**
- Run the `supabase-schema.sql` in the SQL Editor

**Data not showing up**
- Check the Supabase Table Editor to verify data exists
- Check browser console for errors
- Verify environment variables are correct

**Still seeing CSV/fs errors**
- Make sure you updated ALL the imports (see Step 3)
- Clear browser cache and restart dev server

## What Changed

The app now uses Supabase for all data operations:

### Old (CSV-based):
```typescript
// localStorage/CSV files
saveScoresToStorage(csvContent)
getAllScores()
```

### New (Supabase):
```typescript
// Supabase database
importScoresFromCSV(csvContent)
getAllScores() // same function name, different backend!
```

The API is mostly the same, so your existing code continues to work with minimal changes!

## Architecture

### Data Flow

```
Client Upload → Supabase Database → Real-time sync to all clients
     ↓
Client Read ← Supabase Direct Query
```

### Benefits Over CSV:
- ✅ No server/client import issues
- ✅ No "Module not found: fs/promises" errors
- ✅ Real database with SQL queries
- ✅ Automatic indexing and optimization
- ✅ Built-in authentication support
- ✅ Works perfectly in production
- ✅ Data persists across all environments

## Next Steps

1. ✅ Complete Steps 1-5 above
2. ✅ Test the admin panel - upload schedules and scores
3. ✅ Check that data appears in Supabase Table Editor
4. ✅ Verify all pages work (Home, Schedule, Recaps)
5. 🚀 Deploy to Vercel with confidence!

Your data is now in a real database! 🎉

