import * as React from 'react';
import { View, Text } from 'react-native';

import useAuth from '../hooks/useAuth';

const ErrorScreen: React.FC = () => {
  const { error } = useAuth();
  return (
    <View className="flex-1 items-center justify-center">
      {error ? (
        <>
          <Text>Error:</Text>
          <Text>{error.message}</Text>
        </>
      ) : null}
    </View>
  );
};

export default ErrorScreen;
