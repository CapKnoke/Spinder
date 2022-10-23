import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: 'Tinder Clone',
  slug: 'tinder-clone',
  scheme: 'app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: 'dev.sindrebakken.tinderclone',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: '3c33561e-f1f2-47c8-b4ca-8feca0556c08',
    },
    apiBaseUrl: process.env.API_BASE_URL,
  },
};

export default config;
