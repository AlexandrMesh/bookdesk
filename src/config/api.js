const URL = {
  development: 'http://192.168.100.211:3000',
  production: 'http://185.12.94.36:3000',
};

export const IMG_URL = (path) => `https://omegaprokat.ru/images/${path}`;

const config = {
  API_URL: __DEV__ ? URL.development : URL.production,
};

export default config;
