import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TRPCProvider } from './utils/trpc';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './hooks/useAuth';
import StackNavigation from './StackNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const App = () => {
  return (
    <TRPCProvider>
      <AuthProvider>
        <NavigationContainer>
          <SafeAreaProvider>
            <StackNavigation />
            <StatusBar />
          </SafeAreaProvider>
        </NavigationContainer>
      </AuthProvider>
    </TRPCProvider>
  );
};
