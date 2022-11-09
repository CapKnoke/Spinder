import spotifySampleData from 'data/spotifySample.json';

type SpotifyUserData = typeof spotifySampleData;
type SpotifyTopTracks = typeof spotifySampleData.topTracks;
type SpotifyTopArtists = typeof spotifySampleData.topArtists;
type SpotifyRecentlyPlayed = typeof spotifySampleData.recentlyPlayed;

type SpotifyTrack = typeof spotifySampleData.topTracks[0];
type SpotifyArtist = typeof spotifySampleData.topArtists[0];
type SpotifyRecentlyPlayedTrack = typeof spotifySampleData.recentlyPlayed[0];
