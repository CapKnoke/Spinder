import * as React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import Swiper from '@acme/react-native-deck-swiper';
import { useTheme } from '@react-navigation/native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

import { trpc } from '../utils/trpc';
import useAuth from '../hooks/useAuth';
import { User } from '.prisma/client';
import MatchQuee from '../components/MatchQuee';

const HomeScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({
  navigation,
}) => {
  const { logout, user, setError } = useAuth();
  const { colors } = useTheme();

  const [quee, setQuee] = React.useState<User[] | null>(null);
  const [newMatches, setNewMatches] = React.useState<number>(0);

  const swipeRef = React.useRef<Swiper<User>>(null);

  trpc.user.matchQuee.useQuery(user?.id, {
    enabled: !!user,
    onSuccess(data) {
      if (data.length) {
        setQuee(data);
        return;
      }
    },
    onError(err) {
      setError(err);
    },
  });

  trpc.user.newMatches.useQuery(user?.id, {
    enabled: !!user,
    onSuccess(newMatches) {
      setNewMatches(newMatches.length);
      if (newMatches.length) {
        navigation.navigate('Match', { match: newMatches[0] });
      }
    },
    refetchInterval: 10000,
  });

  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="py-2">
        <Button title="Log out" onPress={() => logout()} />
        <Text style={{ color: colors.text }} className="text-center text-lg">
          New Matches: {newMatches}
        </Text>
      </View>
      <MatchQuee quee={quee} swipeRef={swipeRef} />
      <View className="flex-row justify-evenly">
        <TouchableOpacity
          className="items-center justify-center rounded-full w-16 h-16 bg-red-700 bg-transparent opacity-20"
          onPress={() => swipeRef.current?.swipeLeft()}
        >
          <AntDesign name="close" size={32} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center justify-center rounded-full w-16 h-16 bg-green-600 bg-transparent opacity-20"
          onPress={() => swipeRef.current?.swipeRight()}
        >
          <AntDesign name="heart" size={32} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
