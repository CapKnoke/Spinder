import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../lib/firebase';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  User,
} from 'firebase/auth';

interface IAuthContext {
  user: User | null;
  error: Error | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode[] | ReactNode }> = ({ children }) => {
  const [request, _, promptAsync] = useAuthRequest({
    expoClientId: '892524085460-pc1oivmas45e42tpfhrvv1f0gsdhtdk7.apps.googleusercontent.com',
    webClientId: '892524085460-rsa3u2bmr1c8o0il3astujccgs02hfa8.apps.googleusercontent.com',
    androidClientId: '892524085460-rsa3u2bmr1c8o0il3astujccgs02hfa8.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);

  WebBrowser.maybeCompleteAuthSession();

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.dir({ user });
          setUser(user);
        } else {
          setUser(null);
        }
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
    } finally {
      setLoading(false);
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
