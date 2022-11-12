import * as React from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useTheme } from '@react-navigation/native';
import { User } from '../types/trpc';
import SpotifyCard from './SpotifyCard';

const MatchQuee: React.FC<{ quee: User[] | null; swipeRef: React.RefObject<Swiper<User>> }> = ({
  quee,
  swipeRef,
}) => {
  const { colors } = useTheme();
  const handleSwipeLeft = (index: number) => {
    if (quee) {
      const swipedUser = quee[index];
      console.log(`you swiped PASS on ${swipedUser.displayName}`);
    }
  };
  const handleSwipeRight = (index: number) => {
    if (quee) {
      const swipedUser = quee[index];
      console.log(`you swiped PASS on ${swipedUser.displayName}`);
    }
  };
  return (
    <View className="flex-1">
      {quee ? (
        <Swiper
          ref={swipeRef}
          cardStyle={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: 'auto',
            height: 'auto',
          }}
          pointerEvents="box-none"
          cards={quee}
          stackSize={2}
          verticalSwipe={false}
          animateCardOpacity
          onSwipedLeft={handleSwipeLeft}
          onSwipedRight={handleSwipeRight}
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
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

export default MatchQuee;
