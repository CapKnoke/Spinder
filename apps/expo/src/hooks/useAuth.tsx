import * as React from 'react';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  User as FireBaseUser,
} from 'firebase/auth';

import { trpc } from '../utils/trpc';
import { auth } from '../lib/firebase';

import type { TRPCClientErrorLike } from '@trpc/client';
import type { AppRouter } from '@acme/api';
import type { User } from '.prisma/client';

const EXPO_REDIRECT_PARAMS = { useProxy: true, projectNameForProxy: '@capknoke/tinder-clone' };
const NATIVE_REDIRECT_PARAMS = { native: 'dev.sindrebakken.tinderclone://' };
const REDIRECT_PARAMS =
  Constants.appOwnership === 'expo' ? EXPO_REDIRECT_PARAMS : NATIVE_REDIRECT_PARAMS;
const redirectUri = AuthSession.makeRedirectUri(REDIRECT_PARAMS);

interface IAuthContext {
  user: User | null;
  profileComplete: boolean;
  googleUserInfo: FireBaseUser | null;
  error: Error | TRPCClientErrorLike<AppRouter> | null;
  setError: React.Dispatch<React.SetStateAction<Error | TRPCClientErrorLike<AppRouter> | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode[] | React.ReactNode }> = ({
  children,
}) => {
  const [_request, response, promptAsync] = useAuthRequest({
    expoClientId: '892524085460-pc1oivmas45e42tpfhrvv1f0gsdhtdk7.apps.googleusercontent.com',
    webClientId: '892524085460-rsa3u2bmr1c8o0il3astujccgs02hfa8.apps.googleusercontent.com',
    androidClientId: '892524085460-rsa3u2bmr1c8o0il3astujccgs02hfa8.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    redirectUri,
  });

  WebBrowser.maybeCompleteAuthSession();

  const [googleUserInfo, setGoogleUserInfo] = React.useState<FireBaseUser | null>(null);
  const [error, setError] = React.useState<Error | TRPCClientErrorLike<AppRouter> | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadingInitial, setLoadingInitial] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<User | null>(null);
  const [profileComplete, setProfileComplete] = React.useState<boolean>(false);

  trpc.user.byId.useQuery(googleUserInfo?.uid, {
    onSuccess(data) {
      setUser(data);
      if (data?.spotifyData) {
        setProfileComplete(true);
      } else {
        setProfileComplete(false);
      }
    },
    onError(err) {
      setError(err);
    },
    onSettled() {
      setLoadingInitial(false);
      setLoading(false);
    },
  });

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setGoogleUserInfo(data);
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (response?.type === 'success' && response.authentication) {
      const { accessToken, idToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken, accessToken);

      signInWithCredential(auth, credential).catch((err) => {
        setError(err);
        setLoading(false);
      });
    }
  }, [response]);

  const signInWithGoogle = async () => {
    setLoading(true);
    promptAsync().catch((err) => {
      setError(err);
      setLoading(false);
    });
  };

  const logout = async () => {
    signOut(auth).catch(setError);
  };

  const memoedValue = React.useMemo(
    () => ({
      user,
      profileComplete,
      loading,
      setLoading,
      error,
      setError,
      googleUserInfo,
      signInWithGoogle,
      logout,
    }),
    [
      user,
      profileComplete,
      loading,
      setLoading,
      error,
      setError,
      googleUserInfo,
      signInWithGoogle,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return React.useContext(AuthContext);
}
