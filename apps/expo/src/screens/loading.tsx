import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';

const LoadingScreen: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-800">
      <ActivityIndicator size="large" />
    </View>
  );
};

export default LoadingScreen;
