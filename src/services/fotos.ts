import { base64ParaArrayBuffer } from '../utils/imagem';
import { lancarErro } from './erros';
import { supabase } from './supabase';

const BUCKET = 'capas';

export async function enviarFoto(userId: string, base64: string): Promise<string> {
  // A pasta é o id do usuário, é isso que as regras do Storage conferem
  const caminho = `${userId}/${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, base64ParaArrayBuffer(base64), { contentType: 'image/jpeg' });

  if (error) {
    const status = Number((error as { statusCode?: string }).statusCode) || 0;
    lancarErro({ message: error.message }, status);
  }

  return caminho;
}

export async function removerFoto(caminho: string): Promise<void> {
  try {
    await supabase.storage.from(BUCKET).remove([caminho]);
  } catch {
    // Se não apagar o arquivo, só sobra uma imagem solta no bucket
  }
}

export function urlDaFoto(caminho: string | null): string | null {
  if (!caminho) return null;
  return supabase.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl;
}