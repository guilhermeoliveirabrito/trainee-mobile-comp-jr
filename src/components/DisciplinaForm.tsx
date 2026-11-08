import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, fontSize, radius, spacing } from '../styles/theme';
import { Button } from './Button';
import { FeedbackMessage } from './FeedbackMessage';
import { Input } from './Input';

// O que fazer com a foto quando salvar
export type AlteracaoFoto =
  | { acao: 'manter' }
  | { acao: 'remover' }
  | { acao: 'nova'; base64: string; uri: string };

export type ValoresDisciplina = {
  nome: string;
  professor: string;
  semestre: string;
  cor: string;
  foto: AlteracaoFoto;
};

type Props = {
  initial?: Partial<Omit<ValoresDisciplina, 'foto'>>;
  fotoAtualUrl?: string | null;
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

export function DisciplinaForm({ initial, fotoAtualUrl, submitLabel, onSubmit }: Props) {
  const [nome, setNome] = useState(initial?.nome ?? '');
  const [professor, setProfessor] = useState(initial?.professor ?? '');
  const [semestre, setSemestre] = useState(initial?.semestre ?? '');
  const [cor, setCor] = useState(initial?.cor ?? CORES[0]);
  const [foto, setFoto] = useState<AlteracaoFoto>({ acao: 'manter' });
  const [erroNome, setErroNome] = useState('');
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Mostra a foto nova se tiver, senão a que já estava salva
  const previa =
    foto.acao === 'nova' ? foto.uri : foto.acao === 'manter' ? fotoAtualUrl ?? null : null;

  async function escolherFoto() {
    setErroGeral('');

    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        // Com qualidade menor a foto sai em JPEG e o envio fica mais leve
        quality: 0.7,
        base64: true,
      });

      if (resultado.canceled) return;

      const asset = resultado.assets[0];
      if (!asset.base64) {
        setErroGeral('Não foi possível ler essa foto. Tente outra.');
        return;
      }

      setFoto({ acao: 'nova', base64: asset.base64, uri: asset.uri });
    } catch {
      setErroGeral('Não foi possível abrir a galeria.');
    }
  }

  function removerFoto() {
    // Só precisa apagar no servidor se já existia uma foto salva
    setFoto(fotoAtualUrl ? { acao: 'remover' } : { acao: 'manter' });
  }

  async function handleSubmit() {
    if (nome.trim().length < 1) {
      setErroNome('Informe o nome da disciplina.');
      return;
    }

    setErroNome('');
    setErroGeral('');
    setEnviando(true);
    const erro = await onSubmit({ nome, professor, semestre, cor, foto });
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

          <Text style={styles.label}>Foto de capa (opcional)</Text>
          {previa ? (
            <Image source={{ uri: previa }} style={styles.previa} />
          ) : (
            <View style={[styles.previa, styles.semFoto]}>
              <Text style={styles.semFotoTexto}>Sem foto</Text>
            </View>
          )}
          <View style={styles.acoesFoto}>
            <Button
              title={previa ? 'Trocar foto' : 'Escolher foto'}
              variant="outline"
              onPress={escolherFoto}
              disabled={enviando}
            />
            {!!previa && (
              <View style={styles.espaco}>
                <Button
                  title="Remover foto"
                  variant="outline"
                  onPress={removerFoto}
                  disabled={enviando}
                />
              </View>
            )}
          </View>

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
  previa: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  semFoto: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  semFotoTexto: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  acoesFoto: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  espaco: {
    marginTop: spacing.sm,
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