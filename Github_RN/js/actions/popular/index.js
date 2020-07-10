import Types from '../types';
import DataStore from '../../dao/expand/DataStorage';

export function onloadPopularData(storeName, url) {
    return dispatch => {
        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url) // 异步action与数据流
            .then((data) => {
                handlerData(dispatch, storeName, data);
            })
            .catch((error) => {
                console.log(error);
                dispatch({
                    type: Types.LOAD_POPULAR_SUCCESS,
                    storeName,
                    error,
                });
            })
    }
}


function handlerData(dispatch, storeName, data) {
    dispatch({
        type: Types.LOAD_POPULAR_SUCCESS,
        data: data && data.data && data.data.items,
        storeName,
    })
}