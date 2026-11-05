import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../styles/theme';

type Props = {
  colunas: number;
  children: ReactNode;
};

export function GridItem({ colunas, children }: Props) {
  if (colunas <= 1) {
    return <>{children}</>;
  }

  const largura = `${100 / colunas}%` as `${number}%`;

  return <View style={[styles.item, { width: largura }]}>{children}</View>;
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: spacing.sm,
  },
});