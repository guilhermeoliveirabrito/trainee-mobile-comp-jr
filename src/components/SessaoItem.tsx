import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../styles/theme';
import { Sessao } from '../types/sessao';
import { formatarData } from '../utils/datas';
import { formatarDuracao } from '../utils/tempo';

type Props = {
  sessao: Sessao;
};

export function SessaoItem({ sessao }: Props) {
  return (
    <View style={styles.item}>
      <View
        style={[
          styles.ponto,
          { backgroundColor: sessao.disciplinas?.cor ?? colors.border },
        ]}
      />
      <View style={styles.texto}>
        <Text style={styles.nome}>{sessao.disciplinas?.nome ?? 'Disciplina'}</Text>
        <Text style={styles.data}>{formatarData(sessao.data_sessao)}</Text>
      </View>
      <Text style={styles.duracao}>{formatarDuracao(sessao.duracao_minutos)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  ponto: {
    width: 12,
    height: 12,
    marginRight: spacing.md,
    borderRadius: 6,
  },
  texto: {
    flex: 1,
  },
  nome: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  data: {
    marginTop: 2,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  duracao: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
  },
});