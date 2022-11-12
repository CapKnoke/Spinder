import * as React from 'react';
import { View, Image, Text, useWindowDimensions, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
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
    <View className="flex-row">
      <View>
        <Image className="h-20 w-20" source={{ uri: albumImage.url }} />
      </View>
      <View className="flex-1 justify-between px-2">
        <View>
          <Text className="text-md" style={{ color: colors.text }}>
            {track.name}
          </Text>
          <Text className="font-thin text-xs" style={{ color: colors.text }}>
            {track.album.name}
          </Text>
        </View>
        <Text style={{ color: colors.text }} className="text-sm font-semibold">
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
    <View className="flex-row">
      <View>
        <Image className="h-20 w-20" source={{ uri: artistImage.url }} />
      </View>
      <View className="flex-1 justify-between px-2">
        <View>
          <Text className="text-md" style={{ color: colors.text }}>
            {artist.name}
          </Text>
        </View>
        <Text className="font-thin text-xs" style={{ color: colors.text }}>
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
    <View className="flex-row">
      <View>
        <Image className="h-20 w-20" source={{ uri: albumImage.url }} />
      </View>
      <View className="flex-1 justify-between px-2">
        <View>
          <Text className="text-md" style={{ color: colors.text }}>
            {track.name}
          </Text>
          <Text className="font-thin text-xs" style={{ color: colors.text }}>
            {track.album.name}
          </Text>
        </View>
        <Text style={{ color: colors.text }} className="text-sm font-semibold">
          {track.artists.map((artist) => artist.name).join(', ')}
        </Text>
      </View>
    </View>
  );
};

const TopTracksSection: React.FC<{
  topTracks: SpotifyTopTracks;
  listRef: React.RefObject<FlashList<SpotifyTrack>>;
}> = ({ topTracks, listRef }) => {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.card }} className="flex-1">
      <FlashList
        ref={listRef}
        renderItem={({ item }) => {
          return <TrackItem track={item} />;
        }}
        data={topTracks}
        estimatedItemSize={111}
        pointerEvents="box-none"
      />
    </View>
  );
};

const TopArtistsSection: React.FC<{
  topArtists: SpotifyTopArtists;
  listRef: React.RefObject<FlashList<SpotifyArtist>>;
}> = ({ topArtists, listRef }) => {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.card }} className="flex-1">
      <FlashList
        ref={listRef}
        renderItem={({ item }) => {
          return <ArtistItem artist={item} />;
        }}
        data={topArtists}
        estimatedItemSize={111}
        pointerEvents="box-none"
      />
    </View>
  );
};

const RecentlyPlayedSection: React.FC<{
  recentlyPlayed: SpotifyRecentlyPlayed;
  listRef: React.RefObject<FlashList<SpotifyRecentlyPlayedTrack>>;
}> = ({ recentlyPlayed, listRef }) => {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.card }} className="flex-1">
      <FlashList
        ref={listRef}
        renderItem={({ item }) => {
          return <RecentlyPlayedItem recentlyPlayed={item} />;
        }}
        data={recentlyPlayed}
        estimatedItemSize={111}
        pointerEvents="box-none"
      />
    </View>
  );
};

type SceneProps = {
  route: Route;
};

const SpotifyCard: React.FC<{ user: User }> = ({
  user: { displayName, age, gender, spotifyData },
}) => {
  const { topArtists, topTracks, recentlyPlayed } = spotifyData as SpotifyUserData;
  const { colors } = useTheme();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState<number>(0);
  const [routes] = React.useState<Route[]>([
    { key: 'topArtists', title: 'Top Artists' },
    { key: 'topTracks', title: 'Top Tracks' },
    { key: 'recentlyPlayed', title: 'Recently PLayed' },
  ]);
  const topArtistsRef = React.useRef<FlashList<SpotifyArtist>>(null);
  const topTracksRef = React.useRef<FlashList<SpotifyTrack>>(null);
  const recentlyPlayedRef = React.useRef<FlashList<SpotifyRecentlyPlayedTrack>>(null);

  const handleScrollDown = () => {
    switch (index) {
      case 0:
        topArtistsRef.current?.scrollToEnd({ animated: true });
        break;
      case 1:
        topTracksRef.current?.scrollToEnd({ animated: true });
        break;
      case 2:
        recentlyPlayedRef.current?.scrollToEnd({ animated: true });
        break;
      default:
        return;
    }
  };
  const handleScrollUp = () => {
    switch (index) {
      case 0:
        topArtistsRef.current?.scrollToIndex({ animated: true, index: 0 });
        break;
      case 1:
        topTracksRef.current?.scrollToIndex({ animated: true, index: 0 });
        break;
      case 2:
        recentlyPlayedRef.current?.scrollToIndex({ animated: true, index: 0 });
        break;
      default:
        return;
    }
  };

  const renderScene = ({ route }: SceneProps) => {
    switch (route.key) {
      case 'topTracks':
        return <TopTracksSection listRef={topTracksRef} topTracks={topTracks} />;
      case 'topArtists':
        return <TopArtistsSection listRef={topArtistsRef} topArtists={topArtists} />;
      case 'recentlyPlayed':
        return (
          <RecentlyPlayedSection listRef={recentlyPlayedRef} recentlyPlayed={recentlyPlayed} />
        );
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
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={false}
        tabBarPosition={'top'}
      />
      <View style={{ backgroundColor: '#1c1c1c' }}>
        <View className="flex-row border-b border-neutral-800">
          <TouchableOpacity
            className="grow items-center justify-center border-r border-neutral-800 p-3"
            onPress={handleScrollUp}
          >
            <AntDesign name="up" size={16} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            className="grow items-center justify-center p-3"
            onPress={handleScrollDown}
          >
            <AntDesign name="down" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between px-4 py-3">
          <Text style={{ color: colors.text }} className="text-xl">
            {displayName}
          </Text>
          <Text
            style={{ color: colors.text }}
            className="text-xl capitalize"
          >{`${age}, ${gender}`}</Text>
        </View>
      </View>
    </View>
  );
};

export default SpotifyCard;
