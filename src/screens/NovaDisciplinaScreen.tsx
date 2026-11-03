import { router } from 'expo-router';
import { Alert } from 'react-native';
import { DisciplinaForm, ValoresDisciplina } from '../components/DisciplinaForm';
import { criarDisciplina } from '../services/disciplinas';
import { getErrorMessage } from '../utils/errorMessages';

export function NovaDisciplinaScreen() {
  async function handleSalvar(valores: ValoresDisciplina) {
    try {
      await criarDisciplina({
        nome: valores.nome.trim(),
        professor: valores.professor.trim() || null,
        semestre: valores.semestre.trim() || null,
        cor: valores.cor,
      });
    } catch (e) {
      return getErrorMessage(e);
    }

    Alert.alert('Disciplina cadastrada', 'Ela já aparece na sua lista.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
    return null;
  }

  return <DisciplinaForm submitLabel="Cadastrar" onSubmit={handleSalvar} />;
}