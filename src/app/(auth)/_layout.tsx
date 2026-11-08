import { Stack } from 'expo-router';

// Se alguém abrir o cadastro direto por link, o voltar leva pro login
export const unstable_settings = {
  anchor: 'login',
};

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}