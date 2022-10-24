import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../lib/firebase';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  User as FireBaseUser,
} from 'firebase/auth';
import { trpc } from '../utils/trpc';
import Constants from 'expo-constants';
import { User } from '../types/trpc';

const EXPO_REDIRECT_PARAMS = { useProxy: true, projectNameForProxy: '@capknoke/tinder-clone' };
const NATIVE_REDIRECT_PARAMS = { native: 'dev.sindrebakken.tinderclone://' };
const REDIRECT_PARAMS =
  Constants.appOwnership === 'expo' ? EXPO_REDIRECT_PARAMS : NATIVE_REDIRECT_PARAMS;
const redirectUri = AuthSession.makeRedirectUri(REDIRECT_PARAMS);

interface IAuthContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  googleUserInfo: FireBaseUser | null;
  error: Error | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode[] | ReactNode }> = ({ children }) => {
  const [_req, response, promptAsync] = useAuthRequest({
    expoClientId: '892524085460-pc1oivmas45e42tpfhrvv1f0gsdhtdk7.apps.googleusercontent.com',
    webClientId: '892524085460-rsa3u2bmr1c8o0il3astujccgs02hfa8.apps.googleusercontent.com',
    androidClientId: '892524085460-rsa3u2bmr1c8o0il3astujccgs02hfa8.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    redirectUri,
  });

  WebBrowser.maybeCompleteAuthSession();

  const [googleUserInfo, setGoogleUserInfo] = useState<FireBaseUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (response?.type === 'success' && response.authentication) {
      const { accessToken, idToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken, accessToken);

      signInWithCredential(auth, credential);
    }
  }, [response]);

  useEffect(() => {
    onAuthStateChanged(auth, setGoogleUserInfo);
  }, [auth]);

  useEffect(() => {
    if (googleUserInfo) {
      trpc.user.byId.useQuery(googleUserInfo.uid, {
        onSuccess(data) {
          setUser(data);
        },
      });
    }
  }, [googleUserInfo]);

  const signInWithGoogle = async () => {
    setLoading(true);
    promptAsync()
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const logout = async () => {
    setLoading(true);
    signOut(auth)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const memoedValue = useMemo(
    () => ({ user, setUser, loading, setLoading, googleUserInfo, error, signInWithGoogle, logout }),
    [user, setUser, loading, setLoading, googleUserInfo, error, signInWithGoogle, logout]
  );

  return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>;
};

export default function useAuth() {
  return useContext(AuthContext);
}
