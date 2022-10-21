import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TRPCProvider } from './utils/trpc';
import { Auth0Provider } from 'react-native-auth0';

import { HomeScreen } from './screens/home';

export const App = () => {
  return (
    <TRPCProvider>
      <Auth0Provider
        domain={'dev-ri67kluklvpws5t7.eu.auth0.com'}
        clientId={'h6HgGH5gNSuqqamy8YH3YOcMNUOIzh0q'}
      >
        <SafeAreaProvider>
          <HomeScreen />
          <StatusBar />
        </SafeAreaProvider>
      </Auth0Provider>
    </TRPCProvider>
  );
};
