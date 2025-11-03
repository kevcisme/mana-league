import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('🔧 Supabase Config:', {
  url: supabaseUrl ? '✅ Set' : '❌ Missing',
  key: supabaseAnonKey ? '✅ Set' : '❌ Missing',
  urlValue: supabaseUrl,
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Schedule {
  id?: number;
  game_id: string;
  date: string;
  team1: string;
  team2: string;
  time: string;
  location?: string;
  is_playoff?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Score {
  id?: number;
  game_id: string;
  date: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  created_at?: string;
  updated_at?: string;
}

export interface Recap {
  id?: number;
  game_id: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  location: string;
  highlights?: string[];
  player_of_the_match?: string;
  attendance?: number;
  weather?: string;
  recap?: string;
  photos?: string[];
  created_at?: string;
  updated_at?: string;
}

