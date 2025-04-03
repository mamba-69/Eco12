import { createClient } from '@supabase/supabase-js';

// These will need to be replaced with actual values in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Special admin credentials for admin panel access
export const ADMIN_CREDENTIALS = {
  email: "Admin123",
  password: "Expert111"
};

// Function to check if credentials match admin credentials
export const isAdminCredentials = (email: string, password: string) => {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
}; 