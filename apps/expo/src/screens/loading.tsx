import { View, Text } from 'react-native';
import React from 'react';
import useAuth from '../hooks/useAuth';

const LoadingScreen: React.FC = () => {
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
