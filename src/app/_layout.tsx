import { type ErrorBoundaryProps, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErroFallback } from '../components/ErroFallback';
import { LoadingState } from '../components/LoadingState';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { colors } from '../styles/theme';

// Cabeçalho das telas que abrem por cima do menu
const cabecalho = {
  headerShown: true,
  headerBackTitle: 'Voltar',
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.surface,
};

// O Expo Router usa essa função como tela de erro de qualquer rota
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <ErroFallback error={error} onRetry={retry} />;
}

function RootNavigator() {
  const { session, loading } = useAuth();

  // Espera ler a sessão salva, senão o login pisca antes de entrar no app
  if (loading) {
    return <LoadingState message="Carregando sessão..." />;
  }

  // Com sessão só o app aparece, sem sessão só o login (e cai no /login)
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session} redirectTo="/login">
        <Stack.Screen name="(app)" />
        <Stack.Screen
          name="disciplina/nova"
          options={{ ...cabecalho, title: 'Nova disciplina' }}
        />
        <Stack.Screen
          name="disciplina/[id]"
          options={{ ...cabecalho, title: 'Editar disciplina' }}
        />
        <Stack.Screen
          name="atividade/nova"
          options={{ ...cabecalho, title: 'Nova atividade' }}
        />
        <Stack.Screen
          name="atividade/[id]"
          options={{ ...cabecalho, title: 'Editar atividade' }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}