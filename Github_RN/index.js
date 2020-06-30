/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import WelcomePage from './js/pages/WelcomePage'
import AppNavigators from './js/navigator/AppNavigators'

AppRegistry.registerComponent(appName, () => AppNavigators);
