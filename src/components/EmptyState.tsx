import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '../styles/theme';
import { Button } from './Button';

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
      {!!actionLabel && !!onAction && (
        <View style={styles.action}>
          <Button title={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  description: {
    marginTop: spacing.xs,
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
});