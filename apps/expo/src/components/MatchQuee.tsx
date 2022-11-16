import * as React from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Swiper from '@acme/react-native-deck-swiper';

import SpotifyCard from './SpotifyCard';
import { trpc } from '../utils/trpc';
import useAuth from '../hooks/useAuth';

import type { User } from '.prisma/client';

const MatchQuee: React.FC<{ quee: User[] | null; swipeRef: React.RefObject<Swiper<User>> }> = ({
  quee,
  swipeRef,
}) => {
  const { user, setError } = useAuth();
  const { colors } = useTheme();
  const utils = trpc.useContext();
  const swipeMutation = trpc.user.swipe.useMutation({
    onSuccess(data) {
      console.log(`You swiped PASS on ${data.displayName}`);
    },
    onError(err) {
      setError(err);
    },
  });
  const likeMutation = trpc.user.like.useMutation({
    onSuccess({ match, displayName }) {
      console.log(`You swiped Like on ${displayName}`);
      if (match) {
        console.log("It's a match!");
        utils.user.newMatches.invalidate();
      }
    },
    onError(err) {
      setError(err);
    },
  });
  const handleSwipeLeft = (index: number) => {
    if (quee && user) {
      const swipedUser = quee[index];
      swipeMutation.mutate({ userId: user.id, targetUserId: swipedUser.id });
    }
  };
  const handleSwipeRight = (index: number) => {
    if (quee && user) {
      const swipedUser = quee[index];
      likeMutation.mutate({ userId: user.id, targetUserId: swipedUser.id });
    }
  };
  return (
    <View className="flex-1">
      {quee ? (
        <Swiper
          ref={swipeRef}
          pointerEvents="box-none"
          cards={quee}
          stackSize={2}
          verticalSwipe={false}
          animateCardOpacity
          onSwipedLeft={handleSwipeLeft}
          onSwipedRight={handleSwipeRight}
          cardStyle={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: 'auto',
            height: 'auto',
          }}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  textAlign: 'right',
                  color: 'red',
                  fontSize: 40,
                  marginRight: 10,
                },
              },
            },
            right: {
              title: 'MATCH',
              style: {
                label: {
                  color: '#4ded30',
                  fontSize: 40,
                  marginLeft: 10,
                },
              },
            },
          }}
          renderCard={(user) =>
            user ? (
              <View className="grow">
                <SpotifyCard user={user} />
              </View>
            ) : (
              <View
                style={{ backgroundColor: colors.card }}
                className="flex-1 rounded-md overflow-hidden items-center justify-center"
              >
                <Text style={{ color: colors.text }} className="text-lg text-center font-semibold">
                  You have reached the end of your quee
                </Text>
                <Image className="h-24 w-24" source={require('../img/sad_emoji.png')} />
              </View>
            )
          }
        />
      ) : (
        <View
          style={{ backgroundColor: colors.card }}
          className="flex-1 rounded-md overflow-hidden items-center justify-center"
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

export default MatchQuee;
