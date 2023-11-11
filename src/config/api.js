const URL = {
  development: 'http://192.168.100.211:3000',
  production: 'http://91.240.254.163:3000',
};

export const IMG_URL = (path) => `http://91.240.254.163/images/covers/${path}`;

const config = {
  API_URL: __DEV__ ? URL.development : URL.production,
};

export default config;
