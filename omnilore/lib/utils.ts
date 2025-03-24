import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from '@/lib/supabaseClient';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
