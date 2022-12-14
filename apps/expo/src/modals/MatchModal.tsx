import * as React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import useAuth from '../hooks/useAuth';

import type { RootStackParamList } from '../navigation';
import { seeMatch } from '../utils/firestore';

const MatchModal: React.FC<NativeStackScreenProps<RootStackParamList, 'Match'>> = ({
  navigation,
  route,
}) => {
  const { user } = useAuth();
  const { colors } = useTheme();

  const { match } = route.params;

  const femaleAvatar = require('../img/avatar_female.png');
  const maleAvatar = require('../img/avatar_male.png');

  React.useEffect(() => {
    if (!user) return;
    const unsubscribe = navigation.addListener('beforeRemove', async () => {
      await seeMatch(user.id, match.id);
    });
    return unsubscribe;
  }, [user]);

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background, opacity: 0.95 }}
      className="flex-1 justify-between px-4 pt-10 pb-24"
    >
      <View className="items-center">
        <Image
          source={require('../img/its_a_match.png')}
          style={{ resizeMode: 'center', opacity: 100 }}
        />
        <Text
          style={{ color: colors.text }}
          className="text-center text-lg pb-8"
        >{`You matched with ${match.matchedUser.name}! Send them a message?`}</Text>
        <View className="flex-row w-full justify-evenly">
          <Image
            source={user?.gender === 'MALE' ? maleAvatar : femaleAvatar}
            style={{ width: 100, height: 110 }}
          />
          <Image
            source={match.matchedUser.gender === 'MALE' ? maleAvatar : femaleAvatar}
            style={{ width: 100, height: 110 }}
          />
        </View>
      </View>
      <View className="gap-4">
        <TouchableOpacity
          style={{ backgroundColor: colors.primary }}
          className="flex-row items-center justify-center py-2 rounded-md"
        >
          <Ionicons
            style={{ color: colors.text, fontSize: 20, paddingRight: 7 }}
            name="chatbubble-outline"
            className="h-10 w-10"
          />
          <Text style={{ color: colors.text }} className="text-center text-xl">
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: colors.card }}
          className="flex-row items-center justify-center py-2 rounded-md"
          onPress={() => navigation.popToTop()}
        >
          <MaterialCommunityIcons
            style={{ color: colors.text, fontSize: 24, paddingRight: 5 }}
            name="fire"
          />
          <Text style={{ color: colors.text }} className="text-center text-xl">
            Keep Swiping
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MatchModal;
