import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

import useAuth from '../hooks/useAuth';
import SpotifyConnect from '../components/SpotifyConnect';
import { trpc } from '../utils/trpc';

const SpotifyConnectScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'SpotifyConnect'>
> = ({ navigation }) => {
  const { logout } = useAuth();
  const spotifyCredentials = trpc.credentials.getSpotifyCredentials.useQuery();
  return (
    <SafeAreaView>
      <View className="flex flex-col items-center justify-center h-full">
        <View className="py-2">
          <Button title="Log out" onPress={() => logout()} />
        </View>
        <View className="py-8">
          <Text>Connect Spotify Account:</Text>
          {spotifyCredentials.isSuccess ? (
            <SpotifyConnect credentials={spotifyCredentials.data} />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SpotifyConnectScreen;
