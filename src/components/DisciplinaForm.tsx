import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { colors, fontSize, spacing } from '../styles/theme';
import { Button } from './Button';
import { FeedbackMessage } from './FeedbackMessage';
import { Input } from './Input';

export type ValoresDisciplina = {
  nome: string;
  professor: string;
  semestre: string;
  cor: string;
};

type Props = {
  initial?: Partial<ValoresDisciplina>;
  submitLabel: string;
  onSubmit: (valores: ValoresDisciplina) => Promise<string | null>;
};

const CORES = [
  '#3E8EDE',
  '#2E9E6B',
  '#E0A21B',
  '#D64545',
  '#8E5BD9',
  '#E26FA3',
  '#1FA5A5',
  '#7A8699',
];

export function DisciplinaForm({ initial, submitLabel, onSubmit }: Props) {
  const [nome, setNome] = useState(initial?.nome ?? '');
  const [professor, setProfessor] = useState(initial?.professor ?? '');
  const [semestre, setSemestre] = useState(initial?.semestre ?? '');
  const [cor, setCor] = useState(initial?.cor ?? CORES[0]);
  const [erroNome, setErroNome] = useState('');
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit() {
    if (nome.trim().length < 1) {
      setErroNome('Informe o nome da disciplina.');
      return;
    }

    setErroNome('');
    setErroGeral('');
    setEnviando(true);
    const erro = await onSubmit({ nome, professor, semestre, cor });
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
            label="Nome"
            placeholder="Ex.: Cálculo I"
            value={nome}
            onChangeText={setNome}
            error={erroNome}
            maxLength={80}
          />
          <Input
            label="Professor (opcional)"
            placeholder="Nome do professor"
            value={professor}
            onChangeText={setProfessor}
          />
          <Input
            label="Semestre (opcional)"
            placeholder="Ex.: 2026.2"
            value={semestre}
            onChangeText={setSemestre}
          />

          <Text style={styles.label}>Cor</Text>
          <View style={styles.cores}>
            {CORES.map((opcao) => (
              <Pressable
                key={opcao}
                onPress={() => setCor(opcao)}
                accessibilityLabel={`Cor ${opcao}`}
                style={[
                  styles.cor,
                  { backgroundColor: opcao },
                  cor === opcao && styles.corSelecionada,
                ]}
              />
            ))}
          </View>

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
  label: {
    marginBottom: spacing.sm,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  cores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  cor: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  corSelecionada: {
    borderColor: colors.text,
  },
});