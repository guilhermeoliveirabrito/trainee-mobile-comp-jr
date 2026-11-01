import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../styles/theme';

type Props = {
  type: 'success' | 'error';
  text: string;
};

export function FeedbackMessage({ type, text }: Props) {
  return (
    <View
      accessibilityRole="alert"
      style={[styles.box, type === 'success' ? styles.success : styles.error]}
    >
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderRadius: radius.sm,
  },
  success: {
    backgroundColor: '#E3F4EC',
    borderLeftColor: colors.success,
  },
  error: {
    backgroundColor: '#FBE9E9',
    borderLeftColor: colors.danger,
  },
  text: {
    fontSize: fontSize.md,
    color: colors.text,
  },
});