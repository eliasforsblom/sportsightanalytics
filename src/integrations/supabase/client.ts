import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://adicyrhhhoqgiugdqvqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkaWN5cmhob3FnaXVnZHF2cW0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwNzc0NjE3OCwiZXhwIjoyMDIzMzIyMTc4fQ.H3CRZQGDGlBPHp4AEuQIiNP_-XDNgX6BaQFDVS7ZYHI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);