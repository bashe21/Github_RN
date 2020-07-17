import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../dao/expand/DataStorage';
import {handlerData, projectModels} from '../ActionUtil';

export function onloadTrendingData(storeName, url, pageSize, favoriteDao) {
    return dispatch => {
        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url, FLAG_STORAGE.flag_trending) // 异步action与数据流
            .then((data) => {
                handlerData(Types.TRENDING_REFRESH_SUCCESS ,dispatch, storeName, data, pageSize, favoriteDao);
            })
            .catch((error) => {
                console.log(error);
                dispatch({
                    type: Types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error,
                });
            })
    }
}

/* 
加载更多数据
@params:    storeName 当前展示类别
@params: pageIndex 当前页码
@params: pageSize 当前每页加载数量
@params: dataArray 原始数据
@callback: 回调函数，可以通过回调函数向页面通信 比如异常信息展示，没有更多等
*/
export function onloadMoreTrendingData(storeName, pageIndex, pageSize, dataArray=[], favoriteDao, callback) {
    return (
        dispatch => {
            setTimeout(() => { // 模拟网络请求
                if ((pageIndex -1) * pageSize >= dataArray.length) { // 数据已经全部加载完
                    if (typeof callback === 'function') {
                        callback('no more');
                    }
                    dispatch({
                        type: Types.TRENDING_LOAD_MORE_FAIL,
                        error: 'no more',
                        storeName,
                        pageIndex: --pageIndex,
                        projectModes: [dataArray],
                    })
                } else {
                    // 本次和载入的全部数据量
                    let max = pageIndex * pageSize >= dataArray.length ? dataArray.length : pageSize * pageIndex; 
                    projectModels(dataArray.slice(0, max), favoriteDao, data => {
                        dispatch({
                            type: Types.TRENDING_LOAD_MORE_SUCCESS,
                            storeName,
                            pageIndex,
                            projectModes: data,
                        })
                    });  
                }
            }, 500);
        }
    )
}

export function onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray=[], favoriteDao) {
    return dispatch => {
        dispatch({type: Types.TRENDING_REFRESH, storeName: storeName});
        let max = pageIndex * pageSize >= dataArray.length ? dataArray.length : pageSize * pageIndex;
        projectModels(dataArray.slice(0, max), favoriteDao, data => {
            dispatch({
                type: Types.FLUSH_TRENDING_FAVORITE,
                storeName,
                pageIndex,
                projectModes: data,
            })
        });
    }
}