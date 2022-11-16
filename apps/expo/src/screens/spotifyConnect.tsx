import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

import SpotifyConnect from '../components/SpotifyConnect';
import useAuth from '../hooks/useAuth';
import { trpc } from '../utils/trpc';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LoginStackParamList } from '../navigation/loginStack';

const SpotifyConnectScreen: React.FC<
  NativeStackScreenProps<LoginStackParamList, 'SpotifyConnect'>
> = () => {
  const { logout } = useAuth();
  const { colors } = useTheme();
  const spotifyCredentials = trpc.credentials.getSpotifyCredentials.useQuery();
  return (
    <SafeAreaView>
      <View className="flex h-full p-4">
        <View className="py-2">
          <Button title="Log out" onPress={() => logout()} />
        </View>
        <View className="flex-auto items-center justify-center px-4">
          <Text style={{ color: colors.text }} className="text-center text-2xl pb-4 font-semibold">
            Almost there!
          </Text>
          <Text style={{ color: colors.text }} className="text-center text-lg pb-4">
            The final step is to connect your Spotify account
          </Text>
          {spotifyCredentials.isSuccess ? (
            <SpotifyConnect credentials={spotifyCredentials.data} />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SpotifyConnectScreen;
