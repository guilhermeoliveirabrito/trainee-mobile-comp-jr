import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLayoutResponsivo } from '../../hooks/useLayoutResponsivo';
import { colors } from '../../styles/theme';

// No SDK 58 o menu só mostra as telas declaradas aqui embaixo
export default function AppLayout() {
  const { isTablet, larguraMenu } = useLayoutResponsivo();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          // Em tela larga o menu fica sempre aberto, no celular é gaveta
          drawerType: isTablet ? 'permanent' : 'front',
          // Com o menu fixo o botão de abrir não serve pra nada
          headerLeft: isTablet ? () => null : undefined,
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.surface,
          drawerStyle: {
            backgroundColor: colors.surface,
            width: isTablet ? larguraMenu : undefined,
          },
          drawerActiveTintColor: colors.primary,
          drawerActiveBackgroundColor: '#E4EBF5',
          drawerInactiveTintColor: colors.textMuted,
        }}
      >
        <Drawer.Screen name="index" options={{ drawerLabel: 'Início', title: 'Início' }} />
        <Drawer.Screen
          name="atividades"
          options={{ drawerLabel: 'Atividades', title: 'Atividades' }}
        />
        <Drawer.Screen
          name="disciplinas"
          options={{ drawerLabel: 'Disciplinas', title: 'Disciplinas' }}
        />
        <Drawer.Screen name="foco" options={{ drawerLabel: 'Foco', title: 'Foco' }} />
        <Drawer.Screen name="perfil" options={{ drawerLabel: 'Perfil', title: 'Perfil' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}