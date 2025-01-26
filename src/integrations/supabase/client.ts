import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://adicyrhhhoqgiugdqvqm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkaWN5cmhoaG9xZ2l1Z2RxdnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY5MDU2MDAsImV4cCI6MjAyMjQ4MTYwMH0.GG5UmCLcaVAJjJHqYNDVQJ9gHxRb8dHnTQsJDmGpXtg";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);