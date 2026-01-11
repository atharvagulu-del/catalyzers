import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://rnoxehthfxffirafloth.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJub3hlaHRoZnhmZmlyYWZsb3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMjEzNzQsImV4cCI6MjA4MzU5NzM3NH0.9HqDWUW6iYUL6tIkiY3PnJ1vYJobWEunoeMi1XQkV9A"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
