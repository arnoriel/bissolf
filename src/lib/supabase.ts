import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
    return supabaseUrl !== '' && supabaseAnonKey !== '';
};

export const getImageUrl = (bucket: string, path: string) => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};

// Helper untuk profile images
export const getProfileImageUrl = (path: string | undefined) => {
  if (!path) return undefined;
  return getImageUrl('profiles', path);
};

// Helper untuk background images
export const getBackgroundImageUrl = (path: string | undefined) => {
  if (!path) return undefined;
  return getImageUrl('backgrounds', path);
};