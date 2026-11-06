// O supabase-js precisa desse polyfill de URL no React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// A chave publishable pode ficar no app, quem protege os dados é o RLS
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Quebra logo no começo se esqueceram o .env
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Variáveis do Supabase não configuradas. Confira o arquivo .env.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Guarda a sessão no aparelho pra continuar logado depois de fechar o app
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // No celular não tem link de login pra ler da URL
    detectSessionInUrl: false,
  },
});