import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home';
import LoginScreen from './screens/login';
import useAuth from './hooks/useAuth';
import LoadingScreen from './screens/loading';

const StackNavigation: React.FC = () => {
  const Stack = createNativeStackNavigator();
  const { user, loading } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Group>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Group>
      ) : loading ? (
        <Stack.Screen name="Loading" component={LoadingScreen} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigation;
