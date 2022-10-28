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
  const { setLoading, setError, setUser, setProfileComplete, user } = useAuth();
  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };
  const [_request, _response, promptAsync] = AuthSession.useAuthRequest(
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
      if (data.spotifyData) {
        setProfileComplete(true);
        setUser(data);
      }
    },
    onError(err) {
      setError(new Error(err.message));
    },
    onSettled() {
      setLoading(false);
    },
  });

  const grantSpotifyAccess = async () => {
    setLoading(true);
    const response = await promptAsync({ useProxy }).catch(() => {
      setLoading(false);
    });
    if (user && response?.type === 'success' && response.authentication) {
      setSpotifyData.mutate({
        userId: user.id,
        spotifyAccessCode: response.authentication.accessToken,
      });
    }
  };
  return <Button title="Connect to Spotify" onPress={grantSpotifyAccess} />;
};

export default SpotifyConnect;
