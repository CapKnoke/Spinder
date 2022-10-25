import * as React from 'react';
import { Platform, Button } from 'react-native';
import * as AuthSession from 'expo-auth-session';

import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@acme/api';

import { trpc } from '../utils/trpc';
import useAuth from '../hooks/useAuth';

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

const SpotifyConnect: React.FC<{
  credentials: inferProcedureOutput<AppRouter['credentials']['getSpotifyCredentials']>;
}> = ({ credentials: { clientId } }) => {
  const { setLoading, setError, setUser, setProfileComplete } = useAuth();
  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };
  const [_request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: clientId,
      responseType: AuthSession.ResponseType.Token,
      scopes: ['user-top-read', 'user-read-recently-played'],
      redirectUri,
    },
    discovery
  );

  const setSpotifyData = trpc.user.setSpotifyData.useMutation({
    onSuccess(data) {
      setUser(data);
      if (data.spotifyData) {
        setProfileComplete(true);
      }
    },
    onError(err) {
      setError(new Error(err.message));
    },
    onSettled() {
      setLoading(false);
    },
  });

  React.useEffect(() => {
    console.log(response);
    if (response?.type === 'success' && response.authentication) {
      setSpotifyData.mutate({ userId: '', spotifyAccessCode: response.authentication.accessToken });
    }
  }, [response]);
  const grantSpotifyAccess = async () => {
    setLoading(true);
    promptAsync({ useProxy }).catch(() => {
      setLoading(false);
    });
  };
  return <Button title="Connect to Spotify" onPress={grantSpotifyAccess} />;
};

export default SpotifyConnect;
