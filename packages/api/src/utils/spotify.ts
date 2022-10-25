import SpotifyClient from 'spotify-web-api-node';

const spotifyClient = new SpotifyClient();

export const getSpotifyUserData = async (spotifyAccessCode: string) => {
  try {
    spotifyClient.setAccessToken(spotifyAccessCode);
    const topTracks = await spotifyClient.getMyTopTracks({ limit: 10 });
    const topArtists = await spotifyClient.getMyTopArtists({ limit: 10 });
    const recentlyPlayed = await spotifyClient.getMyRecentlyPlayedTracks({ limit: 10 });
    return { topTracks, topArtists, recentlyPlayed };
  } catch (err) {
    if (err instanceof Error) {
      return { error: err };
    }
    return { error: new Error('Spotify API client error') };
  }
};
