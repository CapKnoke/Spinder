import AsyncStorage from '@react-native-async-storage/async-storage';

export const setUserData = async (name: string, data: string | number) => {
  try {
    if (typeof data === 'number') {
      await AsyncStorage.setItem(name, data.toString());
      return;
    }
    await AsyncStorage.setItem(name, data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getUserData = async (name: string) => {
  try {
    const response = await AsyncStorage.getItem(name);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteUserData = async (name: string) => {
  try {
    await AsyncStorage.removeItem(name);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
