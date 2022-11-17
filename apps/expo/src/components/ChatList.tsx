import * as React from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import type { Match } from '../hooks/useMatches';

const femaleAvatar = require('../img/avatar_female.png');
const maleAvatar = require('../img/avatar_male.png');

const ChatListItem: React.FC<{ match: Match }> = ({ match }) => {
  const { colors } = useTheme();
  return (
    <View className="flex-row">
      <View className="p-2">
        <Image
          className="h-16 w-16"
          style={{ resizeMode: 'center' }}
          source={match.matchedUser.gender === 'MALE' ? maleAvatar : femaleAvatar}
        />
      </View>
      <View className="flex-1 px-2 pt-3 pb-2 justify-between">
        <View>
          <Text style={{ color: colors.text, fontSize: 18 }}>{match.matchedUser.name}</Text>
        </View>
        <View className="flex-row justify-between">
          {match.lastMessage ? (
            <>
              <Text style={{ color: colors.text }}>{match.lastMessage.message}</Text>
              <Text style={{ color: colors.text }}>
                {match.lastMessage.createdAt.toDate().toTimeString()}
              </Text>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const ChatList: React.FC<{
  matches: Match[] | null;
}> = ({ matches }) => {
  const { colors } = useTheme();
  const listRef = React.useRef<FlashList<Match>>(null);
  return (
    <View style={{ backgroundColor: colors.card }} className="flex-1 rounded-md overflow-hidden">
      {matches ? (
        matches.length ? (
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
          <View className="flex-1 pt-8">
            <Text style={{ color: colors.text }} className="text-center">
              No matches.
            </Text>
          </View>
        )
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default ChatList;
