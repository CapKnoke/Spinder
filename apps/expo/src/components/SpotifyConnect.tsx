import * as React from 'react';
import { Platform, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as AuthSession from 'expo-auth-session';

import { trpc } from '../utils/trpc';
import useAuth from '../hooks/useAuth';

import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@acme/api';

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

const SpotifyConnect: React.FC<{
  credentials: inferProcedureOutput<AppRouter['credentials']['getSpotifyCredentials']>;
}> = ({ credentials: { clientId } }) => {
  const { setLoading, setError, setUser, setProfileComplete, user } = useAuth();
  const { colors } = useTheme();
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

  const { mutate } = trpc.user.setSpotifyData.useMutation({
    onSuccess(data) {
      if (data.spotifyData) {
        setProfileComplete(true);
        setUser(data);
      }
    },
    onError(err) {
      setError(err);
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
      mutate({
        userId: user.id,
        spotifyAccessCode: response.authentication.accessToken,
      });
    }
  };
  return (
    <TouchableOpacity
      style={{ backgroundColor: colors.primary }}
      className="rounded-md px-8 py-3"
      onPress={grantSpotifyAccess}
    >
      <Text style={{ color: colors.text }} className="font-bold text-lg">
        Connect to Spotify
      </Text>
    </TouchableOpacity>
  );
};

export default SpotifyConnect;
