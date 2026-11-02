import { ReactNode } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSize, radius, spacing } from '../styles/theme';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const LARGURA_TABLET = 768;

export function AuthLayout({ title, subtitle, children }: Props) {
  const { width } = useWindowDimensions();
  const isTablet = width >= LARGURA_TABLET;

  return (
    <View style={[styles.root, isTablet && styles.rootTablet]}>
      <SafeAreaView edges={['top']} style={[styles.brand, isTablet && styles.brandTablet]}>
        <View style={styles.emblem}>
          <Text style={styles.emblemLetter}>M</Text>
        </View>
        <Text style={styles.brandName}>Mentor</Text>
        <Text style={styles.brandTagline}>Organize seus estudos em um só lugar</Text>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={styles.formArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.card, isTablet && styles.cardTablet]}>
            <View style={styles.inner}>
              <Text style={styles.title}>{title}</Text>
              {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              {children}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  rootTablet: {
    flexDirection: 'row',
  },
  brand: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  brandTablet: {
    flex: 1,
    justifyContent: 'center',
  },
  emblem: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemLetter: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.surface,
  },
  brandName: {
    marginTop: spacing.md,
    fontSize: fontSize.title,
    fontWeight: '700',
    color: colors.surface,
  },
  brandTagline: {
    marginTop: spacing.xs,
    fontSize: fontSize.md,
    color: '#B9C6DA',
    textAlign: 'center',
  },
  formArea: {
    flex: 1,
  },
  formContent: {
    flexGrow: 1,
  },
  card: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  cardTablet: {
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: radius.lg,
  },
  inner: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
});