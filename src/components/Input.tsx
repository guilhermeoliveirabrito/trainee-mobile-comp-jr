import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../styles/theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
  password?: boolean;
};

export function Input({ label, error, password, style, ...rest }: Props) {
  const [oculta, setOculta] = useState(true);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          {...rest}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={password ? oculta : rest.secureTextEntry}
          style={[
            styles.input,
            !!password && styles.inputComAcao,
            !!error && styles.inputError,
            style,
          ]}
        />
        {!!password && (
          <Pressable
            onPress={() => setOculta((valor) => !valor)}
            hitSlop={8}
            accessibilityLabel={oculta ? 'Mostrar senha' : 'Ocultar senha'}
            style={styles.toggle}
          >
            <Text style={styles.toggleText}>{oculta ? 'Mostrar' : 'Ocultar'}</Text>
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    fontSize: fontSize.md,
    color: colors.text,
  },
  inputComAcao: {
    paddingRight: 84,
  },
  inputError: {
    borderColor: colors.danger,
  },
  toggle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: spacing.md,
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.accent,
  },
  error: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.danger,
  },
});