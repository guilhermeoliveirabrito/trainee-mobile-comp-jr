import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { PRIORIDADES, STATUS, TIPOS } from '../constants/atividade';
import { colors, spacing } from '../styles/theme';
import {
    PrioridadeAtividade,
    StatusAtividade,
    TipoAtividade,
} from '../types/atividade';
import { Disciplina } from '../types/disciplina';
import { Button } from './Button';
import { DatePickerField } from './DatePickerField';
import { FeedbackMessage } from './FeedbackMessage';
import { Input } from './Input';
import { OptionSelector } from './OptionSelector';

export type ValoresAtividade = {
  disciplina_id: string;
  titulo: string;
  descricao: string;
  tipo: TipoAtividade;
  prioridade: PrioridadeAtividade;
  status: StatusAtividade;
  data_entrega: string | null;
};

type Props = {
  disciplinas: Disciplina[];
  initial?: Partial<ValoresAtividade>;
  submitLabel: string;
  onSubmit: (valores: ValoresAtividade) => Promise<string | null>;
};

export function AtividadeForm({ disciplinas, initial, submitLabel, onSubmit }: Props) {
  const [disciplinaId, setDisciplinaId] = useState(initial?.disciplina_id ?? '');
  const [titulo, setTitulo] = useState(initial?.titulo ?? '');
  const [descricao, setDescricao] = useState(initial?.descricao ?? '');
  const [tipo, setTipo] = useState<TipoAtividade>(initial?.tipo ?? 'tarefa');
  const [prioridade, setPrioridade] = useState<PrioridadeAtividade>(
    initial?.prioridade ?? 'media'
  );
  const [status, setStatus] = useState<StatusAtividade>(initial?.status ?? 'pendente');
  const [dataEntrega, setDataEntrega] = useState<string | null>(
    initial?.data_entrega ?? null
  );
  const [erroTitulo, setErroTitulo] = useState('');
  const [erroDisciplina, setErroDisciplina] = useState('');
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit() {
    const semTitulo = titulo.trim().length < 1;
    const semDisciplina = !disciplinaId;

    setErroTitulo(semTitulo ? 'Informe o título da atividade.' : '');
    setErroDisciplina(semDisciplina ? 'Escolha uma disciplina.' : '');
    setErroGeral('');
    if (semTitulo || semDisciplina) return;

    setEnviando(true);
    const erro = await onSubmit({
      disciplina_id: disciplinaId,
      titulo,
      descricao,
      tipo,
      prioridade,
      status,
      data_entrega: dataEntrega,
    });
    setEnviando(false);

    if (erro) setErroGeral(erro);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          {!!erroGeral && <FeedbackMessage type="error" text={erroGeral} />}

          <Input
            label="Título"
            placeholder="Ex.: Lista de exercícios 3"
            value={titulo}
            onChangeText={setTitulo}
            error={erroTitulo}
            maxLength={120}
          />

          <OptionSelector
            label="Disciplina"
            options={disciplinas.map((d) => ({
              value: d.id,
              label: d.nome,
              color: d.cor,
            }))}
            value={disciplinaId || null}
            onChange={setDisciplinaId}
            error={erroDisciplina}
          />

          <OptionSelector label="Tipo" options={TIPOS} value={tipo} onChange={setTipo} />
          <OptionSelector
            label="Prioridade"
            options={PRIORIDADES}
            value={prioridade}
            onChange={setPrioridade}
          />
          <OptionSelector
            label="Status"
            options={STATUS}
            value={status}
            onChange={setStatus}
          />

          <DatePickerField
            label="Data de entrega (opcional)"
            value={dataEntrega}
            onChange={setDataEntrega}
          />

          <Input
            label="Descrição (opcional)"
            placeholder="Detalhes da atividade"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            style={styles.descricao}
          />

          <Button
            title={enviando ? 'Salvando...' : submitLabel}
            onPress={handleSubmit}
            disabled={enviando}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  form: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  descricao: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});