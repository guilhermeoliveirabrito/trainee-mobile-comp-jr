import { useWindowDimensions } from 'react-native';

const LARGURA_TABLET = 768;
const LARGURA_MENU = 260;
// Abaixo disso duas colunas ficam apertadas
const LARGURA_MINIMA_DUAS_COLUNAS = 640;

export function useLayoutResponsivo() {
  const { width } = useWindowDimensions();

  const isTablet = width >= LARGURA_TABLET;
  // O menu fixo come espaço, então desconta antes de contar as colunas
  const larguraConteudo = isTablet ? width - LARGURA_MENU : width;
  const colunas = larguraConteudo >= LARGURA_MINIMA_DUAS_COLUNAS ? 2 : 1;

  return { isTablet, colunas, larguraMenu: LARGURA_MENU };
}