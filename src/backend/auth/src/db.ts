import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveToken(userId: string, token: any) {
  // Exemplo simples de armazenamento
  const { error } = await supabase
    .from('tokens')
    .upsert({ user_id: userId, token })
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getToken(userId: string) {
  const { data, error } = await supabase
    .from('tokens')
    .select('token')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data?.token;
}
