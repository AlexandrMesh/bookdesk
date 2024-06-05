import AsyncStorage from '@react-native-async-storage/async-storage';

const URL = {
  development: 'http://192.168.100.99:3000',
};

export const getImgUrl = async () => {
  const imgUrl = await AsyncStorage.getItem('imgUrl');
  return `${imgUrl}/images/covers`;
};

export const getApiUrl = async () => {
  const apiUrl = await AsyncStorage.getItem('apiUrl');
  return __DEV__ ? URL.development : apiUrl;
};
