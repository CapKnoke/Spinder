import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LoginStackParamList } from '../navigation/loginStack';

import useAuth from '../hooks/useAuth';
import UpdateUserInfo from '../components/UpdateUserInfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

const RegisterScreen: React.FC<NativeStackScreenProps<LoginStackParamList, 'Register'>> = ({
  navigation,
}) => {
  const { logout, user } = useAuth();
  const { colors } = useTheme();
  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <View className="flex flex-col h-full p-4">
          <View className="py-2">
            <Button title="Log out" onPress={() => logout()} />
          </View>
          <Text style={{ color: colors.text }} className="text-center text-xl font-semibold">
            Update user info
          </Text>
          <UpdateUserInfo {...user} />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
