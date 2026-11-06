import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { FeedbackMessage } from '../components/FeedbackMessage';
import { LoadingState } from '../components/LoadingState';
import { OptionSelector } from '../components/OptionSelector';
import { SessaoItem } from '../components/SessaoItem';
import { useCronometro } from '../hooks/useCronometro';
import { useDisciplinas } from '../hooks/useDisciplinas';
import { useSessoes } from '../hooks/useSessoes';
import { criarSessao } from '../services/sessoes';
import { colors, fontSize, radius, spacing } from '../styles/theme';
import { hojeIso } from '../utils/datas';
import { getErrorMessage } from '../utils/errorMessages';
import { formatarDuracao, formatarTempo, inicioDaSemanaIso } from '../utils/tempo';

const DURACOES = [
  { value: '1', label: '1 min' },
  { value: '15', label: '15 min' },
  { value: '25', label: '25 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '60 min' },
];

type Aviso = { type: 'success' | 'error'; text: string } | null;

export function FocoScreen() {
  const dadosDisciplinas = useDisciplinas();
  const dadosSessoes = useSessoes();
  const [disciplinaId, setDisciplinaId] = useState('');
  const [minutos, setMinutos] = useState('25');
  const [aviso, setAviso] = useState<Aviso>(null);
  const [salvando, setSalvando] = useState(false);
  const [pendente, setPendente] = useState<number | null>(null);

  const totalSegundos = Number(minutos) * 60;
  const cronometro = useCronometro(totalSegundos, (segundos) => {
    salvar(segundos);
  });

  async function salvar(segundos: number) {
    const minutosSessao = Math.floor(segundos / 60);

    if (minutosSessao < 1) {
      setAviso({
        type: 'error',
        text: 'Estude pelo menos 1 minuto para registrar a sessão.',
      });
      return;
    }

    setSalvando(true);
    setAviso(null);

    try {
      await criarSessao({
        disciplina_id: disciplinaId,
        duracao_minutos: minutosSessao,
        data_sessao: hojeIso(),
      });
    } catch (e) {
      setPendente(segundos);
      setAviso({ type: 'error', text: getErrorMessage(e) });
      setSalvando(false);
      return;
    }

    setSalvando(false);
    setPendente(null);
    cronometro.reiniciar();
    setAviso({
      type: 'success',
      text: `Sessão registrada: ${formatarDuracao(minutosSessao)}.`,
    });
    await dadosSessoes.recarregar();
  }

  function handleIniciar() {
    if (!disciplinaId) {
      setAviso({ type: 'error', text: 'Escolha uma disciplina para começar.' });
      return;
    }

    setAviso(null);
    cronometro.iniciar();
  }

  function handleFinalizar() {
    cronometro.pausar();
    salvar(cronometro.decorridoSegundos);
  }

  function handleDescartar() {
    setPendente(null);
    setAviso(null);
    cronometro.reiniciar();
  }

  async function recarregarTudo() {
    await Promise.all([dadosDisciplinas.recarregar(), dadosSessoes.recarregar()]);
  }

  if (dadosDisciplinas.loading || dadosSessoes.loading) {
    return <LoadingState message="Carregando..." />;
  }

  const erro = dadosDisciplinas.erro || dadosSessoes.erro;

  if (erro) {
    return (
      <View style={styles.erro}>
        <FeedbackMessage type="error" text={erro} />
        <Button title="Tentar novamente" variant="outline" onPress={recarregarTudo} />
      </View>
    );
  }

  if (dadosDisciplinas.disciplinas.length === 0) {
    return (
      <View style={styles.vazio}>
        <EmptyState
          title="Cadastre uma disciplina primeiro"
          description="As sessões de estudo são registradas em uma disciplina."
          actionLabel="Cadastrar disciplina"
          onAction={() => router.push('/disciplina/nova')}
        />
      </View>
    );
  }

  const inicioSemana = inicioDaSemanaIso();
  const minutosSemana = dadosSessoes.sessoes
    .filter((sessao) => sessao.data_sessao >= inicioSemana)
    .reduce((total, sessao) => total + sessao.duracao_minutos, 0);
  const recentes = dadosSessoes.sessoes.slice(0, 5);

  const emAndamento = cronometro.estado === 'rodando' || cronometro.estado === 'pausado';
  const rotuloPrincipal =
    cronometro.estado === 'rodando'
      ? 'Pausar'
      : cronometro.estado === 'pausado'
        ? 'Retomar'
        : 'Iniciar';
  const acaoPrincipal =
    cronometro.estado === 'rodando'
      ? cronometro.pausar
      : cronometro.estado === 'pausado'
        ? cronometro.iniciar
        : handleIniciar;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={dadosDisciplinas.refreshing || dadosSessoes.refreshing}
          onRefresh={recarregarTudo}
        />
      }
    >
      <View style={styles.coluna}>
        <View style={styles.semana}>
          <Text style={styles.semanaRotulo}>Estudado nesta semana</Text>
          <Text style={styles.semanaValor}>{formatarDuracao(minutosSemana)}</Text>
        </View>

        {!!aviso && <FeedbackMessage type={aviso.type} text={aviso.text} />}

        <OptionSelector
          label="Disciplina"
          options={dadosDisciplinas.disciplinas.map((d) => ({
            value: d.id,
            label: d.nome,
            color: d.cor,
          }))}
          value={disciplinaId || null}
          onChange={setDisciplinaId}
          disabled={cronometro.estado !== 'parado'}
        />

        <OptionSelector
          label="Duração"
          options={DURACOES}
          value={minutos}
          onChange={setMinutos}
          disabled={cronometro.estado !== 'parado'}
        />

        <View style={styles.relogio}>
          <Text style={styles.tempo}>{formatarTempo(cronometro.restanteSegundos)}</Text>
        </View>

        {pendente !== null ? (
          <>
            <Button
              title={salvando ? 'Salvando...' : 'Tentar salvar novamente'}
              onPress={() => salvar(pendente)}
              disabled={salvando}
            />
            <View style={styles.espaco} />
            <Button
              title="Descartar sessão"
              variant="outline"
              onPress={handleDescartar}
              disabled={salvando}
            />
          </>
        ) : (
          <>
            <Button
              title={salvando ? 'Salvando...' : rotuloPrincipal}
              onPress={acaoPrincipal}
              disabled={salvando || cronometro.estado === 'concluido'}
            />
            {emAndamento && (
              <>
                <View style={styles.espaco} />
                <Button
                  title="Finalizar e salvar"
                  variant="outline"
                  onPress={handleFinalizar}
                  disabled={salvando}
                />
                <View style={styles.espaco} />
                <Button
                  title="Reiniciar"
                  variant="outline"
                  onPress={handleDescartar}
                  disabled={salvando}
                />
              </>
            )}
          </>
        )}

        <Text style={styles.titulo}>Sessões recentes</Text>
        {recentes.length > 0 ? (
          recentes.map((sessao) => <SessaoItem key={sessao.id} sessao={sessao} />)
        ) : (
          <Text style={styles.semSessoes}>
            Suas sessões de estudo aparecem aqui depois que você registrar a primeira.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  conteudo: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  coluna: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  erro: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  vazio: {
    flex: 1,
    backgroundColor: colors.background,
  },
  semana: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  semanaRotulo: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  semanaValor: {
    marginTop: spacing.xs,
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  relogio: {
    alignItems: 'center',
    marginVertical: spacing.lg,
    paddingVertical: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  tempo: {
    fontSize: 64,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  espaco: {
    height: spacing.sm,
  },
  titulo: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  semSessoes: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});