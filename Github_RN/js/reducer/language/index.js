import Types from '../../actions/types'
import {FLAG_LANGUAGE} from '../../dao/expand/LanguageDao';

const defaultState = {
    languages: [],
    keys: [],
}

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.LANGUAGE_LOAD_SUCCESS: // 获取数据成功
            if (FLAG_LANGUAGE.flag_language === action.flag) {
                return ({
                    ...state,
                    keys: action.languages,
                })
            } else {
                return ({
                    ...state,
                    languages: action.languages,
                })
            }
            break;
        default:
            return state;
    }
}