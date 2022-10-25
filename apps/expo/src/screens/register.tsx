import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

import useAuth from '../hooks/useAuth';
import UpdateUserInfo from '../components/UpdateUserInfo';

const RegisterScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Register'>> = ({
  navigation,
}) => {
  const { logout, user } = useAuth();
  return (
    <SafeAreaView>
      <View className="flex flex-col h-full p-4">
        <View className="py-2">
          <Button title="Log out" onPress={() => logout()} />
        </View>
        <Text className="text-center text-xl">Register User Data</Text>
        <UpdateUserInfo {...user} />
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
