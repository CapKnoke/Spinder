import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home';
import LoginScreen from '../screens/login';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../screens/loading';
import RegisterScreen from '../screens/register';
import SpotifyConnectScreen from '../screens/spotifyConnect';

export type RootStackParamList = {
  Loading: undefined;
  Home: undefined;
  Register: undefined;
  SpotifyConnect: undefined;
  Login: undefined;
};

const StackNavigation: React.FC = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { user, profileComplete, loading, googleUserInfo } = useAuth();

  if (loading) {
    return <Stack.Screen name="Loading" component={LoadingScreen} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {profileComplete ? (
        <Stack.Group>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Group>
      ) : googleUserInfo ? (
        <Stack.Group>
          {user ? (
            <Stack.Screen name="SpotifyConnect" component={SpotifyConnectScreen} />
          ) : (
            <Stack.Screen name="Register" component={RegisterScreen} />
          )}
        </Stack.Group>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigation;
