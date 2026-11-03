import DateTimePicker from '@expo/ui/community/datetime-picker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../styles/theme';
import { deIso, formatarData, hojeIso, paraIso } from '../utils/datas';

type Props = {
  label: string;
  value: string | null;
  onChange: (valor: string | null) => void;
};

export function DatePickerField({ label, value, onChange }: Props) {
  const [aberto, setAberto] = useState(false);

  const seletor = (
    <DateTimePicker
      value={value ? deIso(value) : new Date()}
      mode="date"
      locale="pt_BR"
      display={Platform.OS === 'ios' ? 'inline' : 'default'}
      themeVariant="light"
      accentColor={colors.primary}
      onValueChange={(_evento, data) => {
        setAberto(false);
        onChange(paraIso(data));
      }}
      onDismiss={() => setAberto(false)}
    />
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.linha}>
        <Pressable style={styles.campo} onPress={() => setAberto((atual) => !atual)}>
          <Text style={value ? styles.valor : styles.placeholder}>
            {value ? formatarData(value) : 'Selecionar data'}
          </Text>
        </Pressable>
        {value ? (
          <Pressable onPress={() => onChange(null)} hitSlop={8}>
            <Text style={styles.acao}>Limpar</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setAberto(false);
              onChange(hojeIso());
            }}
            hitSlop={8}
          >
            <Text style={styles.acao}>Hoje</Text>
          </Pressable>
        )}
      </View>

      {aberto &&
        (Platform.OS === 'ios' ? (
          <View style={styles.calendario}>{seletor}</View>
        ) : (
          seletor
        ))}
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
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  campo: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  valor: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  placeholder: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  acao: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.accent,
  },
  calendario: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
});