
/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// No ambiente de desenvolvimento local, estas variáveis vêm do .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase: Variáveis de ambiente ausentes. Verifique seu arquivo .env ou as configurações do provedor de hospedagem.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
