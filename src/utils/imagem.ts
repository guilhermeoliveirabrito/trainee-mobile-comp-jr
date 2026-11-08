// O seletor devolve a foto em base64, o upload precisa dos bytes
export function base64ParaArrayBuffer(base64: string): ArrayBuffer {
  const binario = atob(base64);
  const buffer = new ArrayBuffer(binario.length);
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < binario.length; i++) {
    bytes[i] = binario.charCodeAt(i);
  }

  return buffer;
}