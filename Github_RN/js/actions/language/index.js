import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../dao/expand/DataStorage';
import {handlerData, projectModels} from '../ActionUtil';
import LanguageDao from '../../dao/expand/LanguageDao';

export function onLoadLanguage(flagKey) {
    return async dispatch => {
        try {
            let languages = await new LanguageDao(flagKey).fetch();
            dispatch({type: Types.LANGUAGE_LOAD_SUCCESS, languages: languages, flag: flagKey});

        } catch (error) {
            console.log(error);
        }
    }
}