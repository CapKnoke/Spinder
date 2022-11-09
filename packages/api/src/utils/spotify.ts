import SpotifyClient from 'spotify-web-api-node';

const spotifyClient = new SpotifyClient();

export const getSpotifyUserData = async (spotifyAccessCode: string) => {
  try {
    spotifyClient.setAccessToken(spotifyAccessCode);
    const topTracks = await spotifyClient.getMyTopTracks({ limit: 10 });
    const topArtists = await spotifyClient.getMyTopArtists({ limit: 10 });
    const recentlyPlayed = await spotifyClient.getMyRecentlyPlayedTracks({ limit: 10 });
    if (
      topArtists.statusCode !== 200 ||
      topTracks.statusCode !== 200 ||
      recentlyPlayed.statusCode !== 200
    ) {
      throw new Error('Spotify API client error');
    }
    return {
      topTracks: topTracks.body.items,
      topArtists: topArtists.body.items,
      recentlyPlayed: recentlyPlayed.body.items,
    };
  } catch (err) {
    if (err instanceof Error) {
      return { error: err };
    }
    return { error: new Error('Spotify API client error') };
  }
};
