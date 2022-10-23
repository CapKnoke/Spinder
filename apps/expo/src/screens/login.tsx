import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const LoginScreen: React.FC = () => {
  const { signInWithGoogle, error } = useAuth();
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);
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
