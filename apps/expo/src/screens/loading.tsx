import * as React from 'react';
import { View, Text } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

import useAuth from '../hooks/useAuth';

const LoadingScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Loading'>> = ({
  navigation,
}) => {
  const { error } = useAuth();
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Loading...</Text>
      {error ? (
        <>
          <Text>Error:</Text>
          <Text>{error.message}</Text>
        </>
      ) : null}
    </View>
  );
};

export default LoadingScreen;
