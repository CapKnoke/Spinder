import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../lib/firebase';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from 'firebase/auth';
import { trpc } from '../utils/trpc';
import { inferProcedureOutput } from '@trpc/server';
import { AppRouter } from '@acme/api';

interface IAuthContext {
  user: inferProcedureOutput<AppRouter['user']['findOrCreate']> | null;
  error: Error | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode[] | ReactNode }> = ({ children }) => {
  const [_req, _res, promptAsync] = useAuthRequest({
    expoClientId: '892524085460-pc1oivmas45e42tpfhrvv1f0gsdhtdk7.apps.googleusercontent.com',
    webClientId: '892524085460-rsa3u2bmr1c8o0il3astujccgs02hfa8.apps.googleusercontent.com',
    androidClientId: '892524085460-rsa3u2bmr1c8o0il3astujccgs02hfa8.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });
  const [user, setUser] = useState<inferProcedureOutput<AppRouter['user']['findOrCreate']> | null>(
    null
  );

  WebBrowser.maybeCompleteAuthSession();

  const [error, setError] = useState<Error | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const findOrCreateUser = trpc.user.findOrCreate.useMutation();

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          await findOrCreateUser
            .mutateAsync({
              id: user.uid,
              displayName: user.displayName,
              email: user.email || 'no@email.com',
              emailVerified: user.emailVerified,
            })
            .then((data) => {
              setUser(data);
            });
        } else {
          setUser(null);
        }
        setLoading(false);
        setLoadingInitial(false);
      }),
    []
  );

  const logout = () => {
    setLoading(true);

    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const response = await promptAsync({ useProxy: true });
      if (response.type === 'success') {
        const accessToken = response.authentication?.accessToken;
        const idToken = response.authentication?.idToken;
        const credential = GoogleAuthProvider.credential(idToken, accessToken);

        await signInWithCredential(auth, credential);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
    }
  };

  const memoedValue = useMemo(
    () => ({ user, loading, error, signInWithGoogle, logout }),
    [user, loading, error, signInWithGoogle, logout]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
