# Migration from CSV to Supabase

## Quick Start (5 Minutes)

### 1. Create `.env.local` file

In the root of your project, create a file named `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zyjaciriexhrzxzvwajy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5amFjaXJpZXhocnp4enZ3YWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMjk2NzcsImV4cCI6MjA3NzcwNTY3N30.N_en2Ah8KtxkzNWWZEMxU4_PZbhimZhCom0dpjgHkLk
```

### 2. Run Database Schema in Supabase

1. Go to: https://supabase.com/dashboard/project/zyjaciriexhrzxzvwajy
2. Click **SQL Editor** in the left sidebar
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL Editor and click **Run**

You should see: "Success. No rows returned"

### 3. Update Imports in Your Code

Replace the old imports with new Supabase ones:

**In `src/app/page.tsx`:**
```typescript
// OLD
import { getScheduleGames } from "@/lib/schedule-data";
import { getAllScores } from "@/lib/scores-data";

// NEW
import { getScheduleGames } from "@/lib/schedule-data-supabase";
import { getAllScores } from "@/lib/scores-data-supabase";
```

**In `src/app/schedule/page.tsx`:**
```typescript
// OLD
import { getScheduleGames, getTeams } from "@/lib/schedule-data";

// NEW  
import { getScheduleGames, getTeamsSync as getTeams } from "@/lib/schedule-data-supabase";
```

**In `src/app/recaps/page.tsx`:**
```typescript
// OLD
import { getAllRecaps } from "@/lib/recaps-data";
import { getTeams } from "@/lib/schedule-data";

// NEW
import { getAllRecaps } from "@/lib/recaps-data-supabase";
import { getTeamsSync as getTeams } from "@/lib/schedule-data-supabase";
```

**In `src/app/admin/page.tsx`:**
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

### 4. Import Your Existing Data

1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/admin`
3. Upload your `schedule.csv` file
4. Upload your `scores.csv` file
5. Refresh the page - data should now load from Supabase!

## What Changed

### Architecture

**Before (CSV):**
```
Admin Upload → API Route → CSV File → localStorage fallback
```

**After (Supabase):**
```
Admin Upload → Supabase Database → Real-time sync
```

### Benefits

✅ **No more "Module not found: fs/promises" errors**  
✅ **No more server/client import issues**  
✅ **Real database with proper queries**  
✅ **Data persists across all devices**  
✅ **Automatic backups**  
✅ **Much faster performance**  
✅ **Scalable to millions of records**

### File Changes

**New Files Created:**
- `src/lib/supabase.ts` - Supabase client
- `src/lib/supabase-data.ts` - Database operations
- `src/lib/schedule-data-supabase.ts` - Schedule data layer
- `src/lib/scores-data-supabase.ts` - Scores data layer
- `src/lib/recaps-data-supabase.ts` - Recaps data layer
- `src/lib/csv-parser-supabase.ts` - CSV import helpers
- `supabase-schema.sql` - Database schema

**Old Files (can be deleted after migration):**
- `src/lib/csv-utils-server.ts`
- `src/lib/api-client.ts`
- `src/app/api/schedules/route.ts`
- `src/app/api/scores/route.ts`
- `src/app/api/recaps/route.ts`

## Verification

### Check Database
1. Go to Supabase Dashboard → **Table Editor**
2. Click on `schedules` table - you should see your games
3. Click on `scores` table - you should see your scores
4. Click on `recaps` table - should be empty (will fill when you create recaps)

### Check App
1. Home page should show recent games
2. Schedule page should show all games
3. Recaps page should show game recaps
4. Admin page should allow CSV uploads

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure `.env.local` exists in the root directory
- Restart your dev server: Stop (Ctrl+C) and run `npm run dev` again

**Error: "relation 'schedules' does not exist"**
- You forgot to run the SQL schema in Supabase
- Go back to Step 2

**Data not showing up**
- Check Supabase Table Editor to verify data exists
- Open browser console (F12) and check for errors
- Make sure you updated all the imports

**Still seeing CSV errors**
- Make sure you updated ALL imports (see Step 3)
- Clear your browser cache
- Restart dev server

## Next Steps

After migration is working:

1. **Delete old CSV files** (they're in Supabase now)
2. **Remove old API routes** (not needed anymore)
3. **Set up Supabase auth** (optional, for admin protection)
4. **Add more features** using Supabase queries

Your data is now in a real database! 🎉

