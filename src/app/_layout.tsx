import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LoadingState } from '../components/LoadingState';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { colors } from '../styles/theme';

const cabecalho = {
  headerShown: true,
  headerBackTitle: 'Voltar',
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.surface,
};

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingState message="Carregando sessão..." />;
  }

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