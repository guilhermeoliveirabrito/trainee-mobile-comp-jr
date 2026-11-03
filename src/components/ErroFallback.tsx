import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '../styles/theme';
import { Button } from './Button';

type Props = {
  error: Error;
  onRetry: () => void;
};

export function ErroFallback({ error, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Algo deu errado</Text>
      <Text style={styles.descricao}>
        Ocorreu um erro inesperado no aplicativo. Você pode tentar novamente.
      </Text>
      {__DEV__ && <Text style={styles.detalhe}>{error.message}</Text>}
      <View style={styles.acao}>
        <Button title="Tentar novamente" onPress={onRetry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  titulo: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  descricao: {
    marginTop: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
  detalhe: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
    color: colors.danger,
    textAlign: 'center',
  },
  acao: {
    alignSelf: 'stretch',
    maxWidth: 360,
    marginTop: spacing.lg,
  },
});