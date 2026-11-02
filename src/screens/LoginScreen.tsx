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
  email?: string;
  senha?: string;
};

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleEntrar() {
    const novosErros: Erros = {};
    if (!emailValido.test(email.trim())) {
      novosErros.email = 'Informe um e-mail válido.';
    }
    if (senha.length < 6) {
      novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.';
    }

    setErros(novosErros);
    setErroGeral('');
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    const { error } = await signIn(email.trim(), senha);
    setEnviando(false);

    if (error) setErroGeral(error);
  }

  return (
    <AuthLayout title="Bem-vindo ao Mentor!" subtitle="Faça seu login">
      {!!erroGeral && <FeedbackMessage type="error" text={erroGeral} />}

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
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        error={erros.senha}
        autoCapitalize="none"
        password
      />

      <Button
        title={enviando ? 'Entrando...' : 'Entrar'}
        onPress={handleEntrar}
        disabled={enviando}
      />

      <Text style={styles.footerText}>Ainda não tem conta?</Text>
      <Button
        title="Criar conta"
        variant="outline"
        onPress={() => router.push('/cadastro')}
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