import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { FeedbackMessage } from '../components/FeedbackMessage';
import { Input } from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { colors, fontSize, spacing } from '../styles/theme';

const emailValido = /^\S+@\S+\.\S+$/;

type Erros = {
  nome?: string;
  email?: string;
  senha?: string;
  confirmacao?: string;
};

export function CadastroScreen() {
  const { signUp } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleCadastrar() {
    const novosErros: Erros = {};
    if (nome.trim().length < 2) {
      novosErros.nome = 'Informe seu nome.';
    }
    if (!emailValido.test(email.trim())) {
      novosErros.email = 'Informe um e-mail válido.';
    }
    if (senha.length < 6) {
      novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (confirmacao !== senha) {
      novosErros.confirmacao = 'As senhas não coincidem.';
    }

    setErros(novosErros);
    setErroGeral('');
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    const { error } = await signUp(nome.trim(), email.trim(), senha);
    setEnviando(false);

    if (error) setErroGeral(error);
  }

  return (
    <AuthLayout title="Criar conta" subtitle="Preencha os dados para começar">
      {!!erroGeral && <FeedbackMessage type="error" text={erroGeral} />}

      <Input
        label="Nome"
        placeholder="Como você quer ser chamado"
        value={nome}
        onChangeText={setNome}
        error={erros.nome}
      />
      <Input
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        error={erros.email}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <Input
        label="Senha"
        placeholder="Mínimo de 6 caracteres"
        value={senha}
        onChangeText={setSenha}
        error={erros.senha}
        autoCapitalize="none"
        password
      />
      <Input
        label="Confirmar senha"
        placeholder="Repita a senha"
        value={confirmacao}
        onChangeText={setConfirmacao}
        error={erros.confirmacao}
        autoCapitalize="none"
        password
      />

      <Button
        title={enviando ? 'Criando conta...' : 'Cadastrar'}
        onPress={handleCadastrar}
        disabled={enviando}
      />

      <Text style={styles.footerText}>Já tem uma conta?</Text>
      <Button
        title="Voltar para o login"
        variant="outline"
        onPress={() => router.back()}
        disabled={enviando}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  footerText: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});