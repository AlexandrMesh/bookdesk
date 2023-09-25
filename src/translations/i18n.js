import i18n from 'i18next';
import common from './locales/ru/common.json';
import auth from './locales/ru/auth.json';
import books from './locales/ru/books.json';
import search from './locales/ru/search.json';
import errors from './locales/ru/errors.json';
import profile from './locales/ru/profile.json';
import app from './locales/ru/app.json';
import categories from './locales/ru/categories.json';

i18n.init({
  lng: 'ru',
  whitelist: ['ru'],
  resources: {
    ru: {
      common,
      auth,
      books,
      search,
      errors,
      profile,
      app,
      categories,
    },
  },
});

export const getT = (namespace) => i18n.getFixedT(i18n.language, namespace);

export default i18n;
