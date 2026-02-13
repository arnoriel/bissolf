import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper: cek apakah Supabase sudah dikonfigurasi
export const isSupabaseConfigured = () => {
    return supabaseUrl !== '' && supabaseAnonKey !== '';
};

export const getImageUrl = (path: string) => {
  const { data } = supabase.storage
    .from('image')
    .getPublicUrl(path);

  return data.publicUrl;
};
