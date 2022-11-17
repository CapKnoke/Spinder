import * as React from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import type { MatchListItem } from '../types/trpc';

const femaleAvatar = require('../img/avatar_female.png');
const maleAvatar = require('../img/avatar_male.png');

const ChatListItem: React.FC<{ match: MatchListItem }> = ({ match }) => {
  const { colors } = useTheme();
  return (
    <View className="flex-row">
      <View>
        <Image
          className="h-20 w-20"
          source={match.matchedUser.gender === 'MALE' ? maleAvatar : femaleAvatar}
        />
      </View>
      <View className="flex-1 justify-between p-2">
        <Text style={{ color: colors.text }}>{match.matchedUser.displayName}</Text>
      </View>
    </View>
  );
};

const ChatList: React.FC<{
  matches: MatchListItem[] | null;
}> = ({ matches }) => {
  const { colors } = useTheme();
  const listRef = React.useRef<FlashList<MatchListItem>>(null);
  return (
    <View style={{ backgroundColor: colors.card }} className="flex-1 rounded-md overflow-hidden">
      {matches ? (
        <FlashList
          ref={listRef}
          renderItem={({ item }) => {
            return <ChatListItem match={item} />;
          }}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: colors.border, opacity: 0.4 }} />
          )}
          data={matches}
        />
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default ChatList;
