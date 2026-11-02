import { Session } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { getErrorMessage } from '../utils/errorMessages';

type AuthResult = {
  error: string | null;
};

type AuthContextData = {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (nome: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));

    const { data } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSession(novaSessao);
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
        options: { data: { nome } },
      });
      return { error: error ? getErrorMessage(error) : null };
    } catch (erro) {
      return { error: getErrorMessage(erro) };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signUp, signOut }}>
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