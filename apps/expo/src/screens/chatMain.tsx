import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, collection, addDoc } from 'firebase/firestore';

import ChatList from '../components/ChatList';
import { trpc } from '../utils/trpc';
import useAuth from '../hooks/useAuth';
import { db } from '../lib/firebase';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import type { MatchListItem } from '../types/trpc';

const ChatMainScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'ChatMain'>> = ({
  navigation,
}) => {
  const { user } = useAuth();

  const [matches, setMatches] = React.useState<MatchListItem[] | null>(null);

  React.useEffect(() => {
    if (user) {
    }
  }, [user]);

  trpc.user.matches.useQuery(user?.id, {
    enabled: !!user,
    onSuccess(matches) {
      setMatches(matches);
    },
  });

  return (
    <SafeAreaView className="flex-1 p-4">
      <ChatList matches={matches} />
    </SafeAreaView>
  );
};

export default ChatMainScreen;
