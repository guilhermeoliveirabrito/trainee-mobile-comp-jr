import { Session } from '@supabase/supabase-js';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { supabase } from '../services/supabase';
import { getErrorMessage } from '../utils/errorMessages';

type AuthResult = {
  error: string | null;
};

type AuthContextData = {
  session: Session | null;
  loading: boolean;
  sessaoExpirada: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (nome: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessaoExpirada, setSessaoExpirada] = useState(false);
  // Separa o logout pelo botão de uma sessão que caiu sozinha
  const saidaManual = useRef(false);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));

    const { data } = supabase.auth.onAuthStateChange((evento, novaSessao) => {
      setSession(novaSessao);

      // Se não foi o botão Sair, a sessão expirou
      if (evento === 'SIGNED_OUT') {
        setSessaoExpirada(!saidaManual.current);
      }

      if (evento === 'SIGNED_IN') {
        setSessaoExpirada(false);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? getErrorMessage(error) : null };
    } catch (erro) {
      return { error: getErrorMessage(erro) };
    }
  }

  async function signUp(nome: string, email: string, password: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        // O gatilho do banco lê o nome daqui pra criar o perfil
        options: { data: { nome } },
      });
      return { error: error ? getErrorMessage(error) : null };
    } catch (erro) {
      return { error: getErrorMessage(erro) };
    }
  }

  async function signOut() {
    saidaManual.current = true;
    try {
      await supabase.auth.signOut();
    } finally {
      // Desmarca mesmo se o signOut falhar
      saidaManual.current = false;
    }
  }

  return (
    <AuthContext.Provider
      value={{ session, loading, sessaoExpirada, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider.');
  }
  return context;
}