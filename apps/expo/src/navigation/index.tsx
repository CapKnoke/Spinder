import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';

import HomeScreen from '../screens/home';
import LoadingScreen from '../screens/loading';
import ErrorScreen from '../screens/error';
import MatchModal from '../modals/MatchModal';
import LoginStack from './loginStack';
import useAuth from '../hooks/useAuth';
import { auth } from '../lib/firebase';

import type { NewMatch } from '../types/trpc';
import ChatMainScreen from '../screens/chatMain';
import ChatDetailScreen from '../screens/chatDetail';

export type RootStackParamList = {
  LoginStack: undefined;
  Home: undefined;
  ChatMain: undefined;
  ChatDetail: undefined;
  Match: { match: NewMatch };
};

const StackNavigation: React.FC = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { profileComplete, loading, setLoading, error } = useAuth();
  React.useEffect(() => {
    if (!loading) {
      setLoading(true);
    }
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      if (!data) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (error) {
    return <ErrorScreen />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {profileComplete ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ChatMain" component={ChatMainScreen} />
            <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
            <Stack.Screen name="Match" component={MatchModal} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="LoginStack" component={LoginStack} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigation;
