import * as React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import Swiper from '@acme/react-native-deck-swiper';

import MatchQuee from '../components/MatchQuee';
import { trpc } from '../utils/trpc';
import useAuth from '../hooks/useAuth';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import type { User } from '.prisma/client';

const HomeScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({
  navigation,
}) => {
  const { logout, user, setError } = useAuth();
  const [quee, setQuee] = React.useState<User[] | null>(null);

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

  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="py-2">
        <Button title="Log out" onPress={() => logout()} />
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
