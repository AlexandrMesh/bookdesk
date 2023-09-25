const URL = {
  development: 'http://192.168.100.211:3000',
  production: 'https://site.com:3000',
};

export const IMG_URL = (path) => `https://omegaprokat.ru/images/${path}`;

const config = {
  API_URL: __DEV__ ? URL.development : URL.production,
};

export default config;
