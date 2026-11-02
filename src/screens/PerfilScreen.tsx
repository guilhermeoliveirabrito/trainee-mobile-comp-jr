import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { colors, fontSize, spacing } from '../styles/theme';

export function PerfilScreen() {
  const { session, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Conectado como</Text>
      <Text style={styles.email}>{session?.user.email}</Text>

      <View style={styles.action}>
        <Button title="Sair" variant="outline" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  email: {
    marginTop: spacing.xs,
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  action: {
    marginTop: spacing.xl,
  },
});