module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: ['@react-native', 'airbnb', 'plugin:prettier/recommended', 'plugin:react/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    __DEV__: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'no-shadow': 'off',
    'global-require': 0,
    'arrow-parens': ['error'],
    'object-curly-newline': ['error', { consistent: true }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/require-default-props': 0,
    'react/prop-types': ['error', { ignore: ['navigation'] }],
    'linebreak-style': 0,
    'react-native/no-inline-styles': 0,
    'max-len': ['error', { code: 150 }],
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
