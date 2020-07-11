import Types from '../types';
import DataStore from '../../dao/expand/DataStorage';

export function onloadPopularData(storeName, url, pageSize) {
    return dispatch => {
        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url) // 异步action与数据流
            .then((data) => {
                handlerData(dispatch, storeName, data, pageSize);
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
export function onloadMorePopularData(storeName, pageIndex, pageSize, dataArray=[], callback) {
    return (
        dispatch => {
            setTimeout(() => { // 模拟网络请求
                if ((pageIndex -1) * pageSize >= dataArray.length) { // 数据已经全部加载完
                    if (typeof callback === 'function') {
                        callback('no more');
                    }
                    dispatch({
                        type: Types.POPULAR_LOAD_MORE_FAIL,
                        error: 'no more',
                        storeName,
                        pageIndex: --pageIndex,
                        projectModes: [dataArray],
                    })
                } else {
                    // 本次和载入的全部数据量
                    let max = pageIndex * pageSize >= dataArray.length ? dataArray.length : pageSize * pageIndex;
                    dispatch({
                        type: Types.POPULAR_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModes: dataArray.slice(0, max),
                    })    
                }
            }, 500);
        }
    )
}


function handlerData(dispatch, storeName, data, pageSize) {
    let fixItems = [];
    if (data && data.data && data.data.items) {
        fixItems = data.data.items;
    }
    dispatch({
        type: Types.POPULAR_REFRESH_SUCCESS,
        items: fixItems,
        projectModes: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize), // 第一次要加载的数据
        storeName,
        pageIndex: 1,
    })
}