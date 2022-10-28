import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

import HomeScreen from '../screens/home';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../screens/loading';
import ErrorScreen from '../screens/error';
import LoginStack from './loginStack';

export type RootStackParamList = {
  Home: undefined;
  LoginStack: undefined;
};

const StackNavigation: React.FC = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { profileComplete, loading, setLoading, error, googleUserInfo, user } = useAuth();
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
        <Stack.Group>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Group>
      ) : (
        <Stack.Screen name="LoginStack" component={LoginStack} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigation;
