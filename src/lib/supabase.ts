import { createClient } from "@supabase/supabase-js"

// Supabase configuration

// Get these from: https://supabase.com/dashboard -> Project Settings -> API

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://ahgupwvnzjjjqibmavrp.supabase.co"

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_AZcZMgv6nWv0PW2zZNEAWQ_P-0hQAqM"

// Create Supabase client for frontend use

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to check if Supabase is configured

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
