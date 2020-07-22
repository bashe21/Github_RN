import DeviceInfo from 'react-native-device-info';
import {Dimensions} from 'react-native'

const BACKGROUND_COLOR = '#f3f3f4';
const window = Dimensions.get('window');

export default {
    line: {
        height: 0.5,
        opacity: 0.5,
        backgroundColor: 'darkgray',
    },
    root_container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    backgroundColor: BACKGROUND_COLOR,
    nav_bar_height_ios: DeviceInfo.hasNotch() ? 64 : 44,
    nav_bar_height_android: 50,
    window_height: window.height,
}