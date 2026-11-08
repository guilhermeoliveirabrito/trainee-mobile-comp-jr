import { router } from 'expo-router';
import { Alert } from 'react-native';
import { DisciplinaForm, ValoresDisciplina } from '../components/DisciplinaForm';
import { useAuth } from '../contexts/AuthContext';
import { criarDisciplina } from '../services/disciplinas';
import { enviarFoto, removerFoto } from '../services/fotos';
import { getErrorMessage } from '../utils/errorMessages';

export function NovaDisciplinaScreen() {
  const { session } = useAuth();

  async function handleSalvar(valores: ValoresDisciplina) {
    const userId = session?.user.id;
    if (!userId) return getErrorMessage({ status: 401 });

    let caminho: string | null = null;

    try {
      if (valores.foto.acao === 'nova') {
        caminho = await enviarFoto(userId, valores.foto.base64);
      }

      await criarDisciplina({
        nome: valores.nome.trim(),
        professor: valores.professor.trim() || null,
        semestre: valores.semestre.trim() || null,
        cor: valores.cor,
        foto_path: caminho,
      });
    } catch (e) {
      // Se a disciplina não foi criada, a foto enviada ficou sobrando
      if (caminho) await removerFoto(caminho);
      return getErrorMessage(e);
    }

    Alert.alert('Disciplina cadastrada', 'Ela já aparece na sua lista.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
    return null;
  }

  return <DisciplinaForm submitLabel="Cadastrar" onSubmit={handleSalvar} />;
}