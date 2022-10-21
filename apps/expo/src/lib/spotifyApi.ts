import AuthSession from 'expo-auth-session';
import { trpc } from '../utils/trpc';

const getSpotifyCredentials = () => {
  const credentials = trpc.spotify.getCredentials.useQuery();
  if (credentials.isSuccess) {
    return credentials.data;
  }
  throw new Error('failed to fetch credentials');
};

const scopesArr = ['user-library-read', 'user-read-recently-played', 'user-top-read'];
const scopes = scopesArr.join(' ');

export const getAuthorizationCode = async () => {
  try {
    const credentials = getSpotifyCredentials();
    const redirectUrl = AuthSession.makeRedirectUri({ path: 'redirect' });
    const result = await AuthSession.startAsync({
      authUrl:
        'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' +
        credentials.clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' +
        encodeURIComponent(redirectUrl),
    });
    if (result.type !== 'success') throw new Error('auth failed');
    return result.params.code;
  } catch (err) {
    console.error(err);
  }
};
