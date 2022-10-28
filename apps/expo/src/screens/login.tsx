import * as React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LoginStackParamList } from '../navigation/loginStack';

import useAuth from '../hooks/useAuth';

const LoginScreen: React.FC<NativeStackScreenProps<LoginStackParamList, 'Login'>> = ({
  navigation,
}) => {
  const { signInWithGoogle } = useAuth();
  return (
    <View style={styles.screen}>
      <ImageBackground
        resizeMode="cover"
        style={styles.background}
        source={{ uri: 'https://tinder.com/static/tinder.png' }}
      >
        <TouchableOpacity style={styles.button} onPress={() => signInWithGoogle()}>
          <Text style={styles.buttonText}>Sign in & start swiping</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  background: {
    flex: 1,
    alignItems: 'center',
  },

  button: {
    position: 'absolute',
    bottom: '20%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: '#fe3c72',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default LoginScreen;
