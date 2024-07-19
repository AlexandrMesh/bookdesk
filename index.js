/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// For working Network in react native debugger https://github.com/jhen0409/react-native-debugger/issues/242
if (__DEV__) {
  global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
}

AppRegistry.registerComponent(appName, () => App);
