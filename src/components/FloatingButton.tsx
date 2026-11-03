import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../styles/theme';

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
};

export function FloatingButton({ onPress, accessibilityLabel }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[styles.botao, { bottom: spacing.lg + insets.bottom }]}
    >
      <Text style={styles.texto}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    position: 'absolute',
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  texto: {
    fontSize: 30,
    lineHeight: 34,
    color: colors.surface,
  },
});