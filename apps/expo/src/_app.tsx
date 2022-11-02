import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TRPCProvider } from './utils/trpc';
import { NavigationContainer, DarkTheme, Theme } from '@react-navigation/native';
import { AuthProvider } from './hooks/useAuth';
import StackNavigation from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const theme: Theme = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: 'rgb(29, 185, 84)',
    background: 'rgb(41, 38, 38)',
    text: 'rgb(255, 255, 255)',
    card: 'rgb(54, 52, 52)',
    border: 'rgb(rgb(15,5,5))',
  },
};

export const App = () => {
  return (
    <TRPCProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer theme={theme}>
            <StackNavigation />
            <StatusBar style="light" />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </TRPCProvider>
  );
};
