import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLayoutResponsivo } from '../../hooks/useLayoutResponsivo';
import { colors } from '../../styles/theme';

export default function AppLayout() {
  const { isTablet, larguraMenu } = useLayoutResponsivo();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerType: isTablet ? 'permanent' : 'front',
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