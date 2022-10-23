import * as React from 'react';
import { Platform, Button } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { inferProcedureOutput } from '@trpc/server';
import { AppRouter } from '@acme/api';

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

const SpotifyConnect: React.FC<{
  credentials: inferProcedureOutput<AppRouter['credentials']['getSpotifyCredentials']>;
}> = ({ credentials: { clientId } }) => {
  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };
  const [request, _, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: clientId,
      responseType: AuthSession.ResponseType.Token,
      scopes: ['user-top-read', 'user-read-recently-played'],
    },
    discovery
  );
  const grantSpotifyAccess = async () => {
    console.log({ redirectUri });
    const result = await promptAsync({ useProxy });
    console.log({ request, result });
    if (result.type === 'success' && result.authentication) {
      //   setUserData('spotifyAccesscode', result.params.code);
      //   setUserData('nonce', request.extraParams.nonce);
    }
  };
  return <Button title="Connect to Spotify" onPress={grantSpotifyAccess} />;
};

export default SpotifyConnect;
