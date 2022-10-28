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

import type { User } from '../types/trpc';

import { auth } from '../lib/firebase';
import { trpc } from '../utils/trpc';

const EXPO_REDIRECT_PARAMS = { useProxy: true, projectNameForProxy: '@capknoke/tinder-clone' };
const NATIVE_REDIRECT_PARAMS = { native: 'dev.sindrebakken.tinderclone://' };
const REDIRECT_PARAMS =
  Constants.appOwnership === 'expo' ? EXPO_REDIRECT_PARAMS : NATIVE_REDIRECT_PARAMS;
const redirectUri = AuthSession.makeRedirectUri(REDIRECT_PARAMS);

interface IAuthContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  profileComplete: boolean;
  setProfileComplete: React.Dispatch<React.SetStateAction<boolean>>;
  googleUserInfo: FireBaseUser | null;
  error: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
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
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadingInitial, setLoadingInitial] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<User | null>(null);
  const [profileComplete, setProfileComplete] = React.useState<boolean>(false);

  const getUserFromDb = trpc.user.byId.useMutation({
    onSuccess(data) {
      setUser(data);
      if (data?.spotifyData) {
        setProfileComplete(true);
      } else {
        setProfileComplete(false);
      }
    },
    onError(err) {
      setError(new Error(err.message));
    },
    onSettled(data) {
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
    getUserFromDb.mutate(googleUserInfo?.uid);
  }, [googleUserInfo]);

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
      setUser,
      profileComplete,
      setProfileComplete,
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
      setUser,
      profileComplete,
      setProfileComplete,
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
