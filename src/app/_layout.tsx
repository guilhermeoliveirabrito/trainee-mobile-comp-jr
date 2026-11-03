import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LoadingState } from '../components/LoadingState';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { colors } from '../styles/theme';

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
          options={{
            headerShown: true,
            title: 'Nova disciplina',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.surface,
          }}
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