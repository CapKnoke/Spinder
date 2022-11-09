import * as React from 'react';
import { View, Image, Text, useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@react-navigation/native';
import { TabView, TabBar, NavigationState, Route, SceneRendererProps } from 'react-native-tab-view';

import type {
  SpotifyArtist,
  SpotifyRecentlyPlayed,
  SpotifyRecentlyPlayedTrack,
  SpotifyTopArtists,
  SpotifyTopTracks,
  SpotifyTrack,
  SpotifyUserData,
} from 'src/types/spotify';
import { User } from 'src/types/trpc';

const TrackItem: React.FC<{ track: SpotifyTrack }> = ({ track }) => {
  const albumImage = track.album.images[1];
  const { colors } = useTheme();
  return (
    <View className="p-2 flex flex-row">
      <View>
        <Image className="h-24 w-24" source={{ uri: albumImage.url }} />
      </View>
      <View className="flex-1 justify-between px-2">
        <View>
          <Text className="text-lg" style={{ color: colors.text }}>
            {track.name}
          </Text>
          <Text className="font-thin text-xs" style={{ color: colors.text }}>
            {track.album.name}
          </Text>
        </View>
        <Text style={{ color: colors.text }}>
          {track.artists.map((artist) => artist.name).join(', ')}
        </Text>
      </View>
    </View>
  );
};

const ArtistItem: React.FC<{ artist: SpotifyArtist }> = ({ artist }) => {
  const artistImage = artist.images[1];
  const { colors } = useTheme();
  return (
    <View className="p-2 flex flex-row">
      <View>
        <Image className="h-24 w-24" source={{ uri: artistImage.url }} />
      </View>
      <View className="flex-1 justify-between px-2">
        <View>
          <Text className="text-lg" style={{ color: colors.text }}>
            {artist.name}
          </Text>
        </View>
        <Text className="font-thin" style={{ color: colors.text }}>
          {artist.genres.join(', ')}
        </Text>
      </View>
    </View>
  );
};

const RecentlyPlayedItem: React.FC<{ recentlyPlayed: SpotifyRecentlyPlayedTrack }> = ({
  recentlyPlayed: { track, played_at },
}) => {
  const albumImage = track.album.images[1];
  const { colors } = useTheme();
  return (
    <View className="p-2 flex flex-row">
      <View>
        <Image className="h-24 w-24" source={{ uri: albumImage.url }} />
      </View>
      <View className="flex-1 justify-between px-2">
        <View>
          <Text className="text-lg" style={{ color: colors.text }}>
            {track.name}
          </Text>
          <Text className="font-thin text-xs" style={{ color: colors.text }}>
            {track.album.name}
          </Text>
        </View>
        <Text style={{ color: colors.text }}>
          {track.artists.map((artist) => artist.name).join(', ')}
        </Text>
      </View>
    </View>
  );
};

const TopTracksSection: React.FC<{ topTracks: SpotifyTopTracks }> = ({ topTracks }) => {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.card }} className="flex-1">
      <FlashList
        renderItem={({ item }) => {
          return <TrackItem track={item as SpotifyTrack} />;
        }}
        data={topTracks}
        estimatedItemSize={111}
      />
    </View>
  );
};

const TopArtistsSection: React.FC<{ topArtists: SpotifyTopArtists }> = ({ topArtists }) => {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.card }} className="flex-1">
      <FlashList
        renderItem={({ item }) => {
          return <ArtistItem artist={item as SpotifyArtist} />;
        }}
        data={topArtists}
        estimatedItemSize={111}
      />
    </View>
  );
};

const RecentlyPlayedSection: React.FC<{ recentlyPlayed: SpotifyRecentlyPlayed }> = ({
  recentlyPlayed,
}) => {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.card }} className="flex-1">
      <FlashList
        renderItem={({ item }) => {
          return <RecentlyPlayedItem recentlyPlayed={item as SpotifyRecentlyPlayedTrack} />;
        }}
        data={recentlyPlayed}
        estimatedItemSize={111}
      />
    </View>
  );
};

type SceneProps = {
  route: Route;
};

const SpotifyCard: React.FC<{ spotifyUserData: SpotifyUserData; user: User }> = ({
  spotifyUserData: { topTracks, topArtists, recentlyPlayed },
  user,
}) => {
  const { colors } = useTheme();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState<number>(0);
  const [routes] = React.useState<Route[]>([
    { key: 'topArtists', title: 'Top Artists' },
    { key: 'topTracks', title: 'Top Tracks' },
    { key: 'recentlyPlayed', title: 'Recently PLayed' },
  ]);

  const renderScene = ({ route }: SceneProps) => {
    switch (route.key) {
      case 'topTracks':
        return <TopTracksSection topTracks={topTracks} />;
      case 'topArtists':
        return <TopArtistsSection topArtists={topArtists} />;
      case 'recentlyPlayed':
        return <RecentlyPlayedSection recentlyPlayed={recentlyPlayed} />;
      default:
        return null;
    }
  };

  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<Route>;
    }
  ) => (
    <TabBar
      {...props}
      style={{ backgroundColor: '#1c1c1c' }}
      indicatorStyle={{ backgroundColor: colors.primary }}
      labelStyle={{ textAlign: 'center' }}
    />
  );

  return (
    <View className="flex-1 rounded-md overflow-hidden">
      {user ? (
        <View style={{ backgroundColor: '#1c1c1c' }} className="flex-row justify-between p-4">
          <Text style={{ color: colors.text }} className="text-xl">
            {user.displayName}
          </Text>
          <Text
            style={{ color: colors.text }}
            className="text-xl capitalize"
          >{`${user.age}, ${user.gender}`}</Text>
        </View>
      ) : null}
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={false}
        tabBarPosition={'bottom'}
      />
    </View>
  );
};

export default SpotifyCard;
