import * as React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

import useAuth from '../hooks/useAuth';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

const ChatDetailScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'ChatDetail'>> = ({
  navigation,
}) => {
  return <SafeAreaView className="flex-1"></SafeAreaView>;
};

export default ChatDetailScreen;
