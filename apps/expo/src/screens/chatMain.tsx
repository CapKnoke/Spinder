import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChatList from '../components/ChatList';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import useMatches from '../hooks/useMatches';

const ChatMainScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'ChatMain'>> = ({
  navigation,
}) => {
  const { matches } = useMatches();

  return (
    <SafeAreaView className="flex-1 p-4">
      <ChatList matches={matches} />
    </SafeAreaView>
  );
};

export default ChatMainScreen;
