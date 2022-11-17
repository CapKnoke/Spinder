import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import SpotifyConnectScreen from '../screens/spotifyConnect';
import useAuth from '../hooks/useAuth';

export type LoginStackParamList = {
  SpotifyConnect: undefined;
  Register: undefined;
  Login: undefined;
};

const LoginStack: React.FC = () => {
  const Tab = createNativeStackNavigator<LoginStackParamList>();
  const { user, googleUserInfo } = useAuth();
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {googleUserInfo ? (
        <Tab.Group>
          {user ? (
            <Tab.Screen name="SpotifyConnect" component={SpotifyConnectScreen} />
          ) : (
            <Tab.Screen name="Register" component={RegisterScreen} />
          )}
        </Tab.Group>
      ) : (
        <Tab.Screen name="Login" component={LoginScreen} />
      )}
    </Tab.Navigator>
  );
};

export default LoginStack;
