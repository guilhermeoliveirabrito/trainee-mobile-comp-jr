import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '../styles/theme';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mentor</Text>
      <Text style={styles.subtitle}>Gestão de estudos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
});