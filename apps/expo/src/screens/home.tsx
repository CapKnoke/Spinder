import * as React from 'react';
import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@acme/api';

import { trpc } from '../utils/trpc';
import useAuth from '../hooks/useAuth';
import SpotifyCard from '../components/SpotifyCard';
import { useTheme } from '@react-navigation/native';
import { SpotifyUserData } from 'src/types/spotify';

const HomeScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({
  navigation,
}) => {
  const { logout, user } = useAuth();
  const { colors } = useTheme();
  if (!user || !user.spotifyData) {
    return (
      <SafeAreaView>
        <View className="h-full p-4">
          <View className="py-2">
            <Button title="Log out" onPress={() => logout()} />
          </View>
          <Text style={{ color: colors.text }}>
            Oops! Something went wrong. Please reload or log in again
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View className="h-full p-4">
        <View className="py-2">
          <Button title="Log out" onPress={() => logout()} />
        </View>
        <SpotifyCard spotifyUserData={user.spotifyData as SpotifyUserData} user={user} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
