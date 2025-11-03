-- Mana League Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  game_id TEXT UNIQUE NOT NULL,
  date TEXT NOT NULL,
  team1 TEXT NOT NULL,
  team2 TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT DEFAULT 'Manoa Basketball Gym',
  is_playoff BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  game_id TEXT UNIQUE NOT NULL,
  date TEXT NOT NULL,
  team1 TEXT NOT NULL,
  team2 TEXT NOT NULL,
  score1 INTEGER NOT NULL,
  score2 INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES schedules(game_id) ON DELETE CASCADE
);

-- Recaps table
CREATE TABLE IF NOT EXISTS recaps (
  id SERIAL PRIMARY KEY,
  game_id TEXT UNIQUE NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  team1 TEXT NOT NULL,
  team2 TEXT NOT NULL,
  score1 INTEGER NOT NULL,
  score2 INTEGER NOT NULL,
  location TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  player_of_the_match TEXT,
  attendance INTEGER DEFAULT 0,
  weather TEXT,
  recap TEXT,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES schedules(game_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_schedules_game_id ON schedules(game_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date);
CREATE INDEX IF NOT EXISTS idx_scores_game_id ON scores(game_id);
CREATE INDEX IF NOT EXISTS idx_scores_date ON scores(date);
CREATE INDEX IF NOT EXISTS idx_recaps_game_id ON recaps(game_id);
CREATE INDEX IF NOT EXISTS idx_recaps_date ON recaps(date);

-- Enable Row Level Security (RLS)
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE recaps ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON schedules FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON scores FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON recaps FOR SELECT USING (true);

-- Create policies for authenticated write access (you can modify these based on your auth setup)
CREATE POLICY "Enable insert for authenticated users only" ON schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON schedules FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON schedules FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON scores FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON scores FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON recaps FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON recaps FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON recaps FOR DELETE USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scores_updated_at BEFORE UPDATE ON scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recaps_updated_at BEFORE UPDATE ON recaps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

