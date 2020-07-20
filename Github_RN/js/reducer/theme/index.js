import Types from '../../actions/types'
import ThemeFactory, {ThemeFlags} from '../../res/style/ThemeFactory';

const defaultState = {
    theme: ThemeFactory.createTheme(ThemeFlags.Default),
    onShowCustomThemeView: false,
}
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.THEME_CHANGE:
            return {
                ...state,
                theme: action.theme
            }
            break;
        case Types.SHOW_THEME_View:
            return {
                ...state,
                customThemeViewVisible: action.customThemeViewVisible,
            }
            break;
        default:
            return state;
    }
    
}