// Re-export the existing client to maintain the API I just introduced
// This avoids rewriting all the imports again, while fixing the implementation
export { supabase } from './supabase';
