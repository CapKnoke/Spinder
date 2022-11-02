import * as React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LoginStackParamList } from '../navigation/loginStack';

import useAuth from '../hooks/useAuth';
import { useTheme } from '@react-navigation/native';

const LoginScreen: React.FC<NativeStackScreenProps<LoginStackParamList, 'Login'>> = ({
  navigation,
}) => {
  const { signInWithGoogle } = useAuth();
  const { colors } = useTheme();
  return (
    <View className="flex-1">
      <ImageBackground className="flex-1 items-center" source={require('../img/login_screen.png')}>
        <TouchableOpacity
          style={{ backgroundColor: colors.primary }}
          className="absolute bottom-1/4 rounded-md px-8 py-3"
          onPress={() => signInWithGoogle()}
        >
          <Text style={{ color: colors.text }} className="font-bold text-lg">
            Sign In
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
