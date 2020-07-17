import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../dao/expand/DataStorage';
import {handlerData, projectModels} from '../ActionUtil';
import { max } from 'react-native-reanimated';
import FavoriteDao from '../../dao/expand/FavoriteDao';
import ProjectModel from '../../mo/ProjectModel';

/* 
加载收藏的项目
@params flag 标识
@params isShowLoading 是否显示loading
@returns function（*）
*/
export function onloadFavoriteData(flag, isShowLoading) {
    return dispatch => {
        if (isShowLoading) {
            dispatch({type: Types.FAVORITE_LOAD_DATA, storeName: flag});
        }
        
        new FavoriteDao(flag).getAllItems()
            .then(items => {
                let resultsData = [];
                for (let i = 0; i < items.length; i++) {
                    resultsData.push(new ProjectModel(items[i], true));
                }
                dispatch({type: Types.FAVORITE_LOAD_SUCCESS, projectModes: resultsData, storeName: flag})
            })
            .catch(e => {
                console.log(e);
                dispatch({type: Types.FAVORITE_LOAD_FAIL, error: e, storeName: flag})
            }) 
    }
}