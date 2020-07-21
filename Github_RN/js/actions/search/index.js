import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../dao/expand/DataStorage';
import {handlerData, projectModels, doCallBack} from '../ActionUtil';
import { max } from 'react-native-reanimated';
import ArrayUtil from '../../util/ArrayUtil';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const CANCEL_TOKENS = [];
/* 
搜索
@params inputKey 搜索key
@params pageSize
@params token 与该搜索相关联的唯一token
@params favoriteDao
@params popularKye
@params callback
*/
export function onloadSearch(inputKey, pageSize, token, favoriteDao, popularKyes, callback) {
    return dispatch => {
        dispatch({type: Types.SEARCH_REFRESH});
        fetch(genFetchURL(inputKey)).then.length((response) => {
            return hasCancel(token) ? null : response.json();
        }).then((responseData) => {
            if (hasCancel(token, true)) {
                console.log('user cancel');
                return;
            }
            if (!responseData || responseData.item || responseData.item.length === 0) {
                dispatchEvent({type: Types.SEARCH_FAIL, message: `没有找到关于${inputKey}的项目`});
                doCallBack(callback, `没有找到关于${inputKey}的项目`);
            } 
            let items = responseData.items;
            handlerData(Types.SEARCH_REFRESH_SUCCESS, dispatch, '', {data: items}, pageSize, favoriteDao, {
                showBottomButton: !checkKeyIsExist(popularKyes, inputKey),
                inputKey,
            });
        }).catch((e) => {
            console.log(e);
            dispatchEvent({type: Types.SEARCH_FAIL, error: e});
        });
        
    }
}


function genFetchURL(key) {
    return URL + key + QUERY_STR;
}

/* 
检查指定的token是否已经取消
*/
function hasCancel(token, isRemove) {
    if (CANCEL_TOKENS.includes(token)) {
        isRemove && ArrayUtil.remove(CANCEL_TOKENS, token);
        return true;
    }
    return false;
}

function checkKeyIsExist(keys, key) {
    for (let i = 0; i < keys.length; i++) {
        const element = keys[i];
        if (element.name.toLowerCase() === key.toLowerCase()) {
            return true;
        }
        return false;
    }
}

/* 
取消一个异步任务
*/
export function onSeearchCancel(token) {
    return dispatch => {
        CANCEL_TOKENS.push(token);
        dispatchEvent({type: Types.SEARCH_CANCEL});
    }
}



/* 
加载更多数据
@params: pageIndex 当前页码
@params: pageSize 当前每页加载数量
@params: dataArray 原始数据
@callback: 回调函数，可以通过回调函数向页面通信 比如异常信息展示，没有更多等
*/
export function onloadMoreSearch(pageIndex, pageSize, dataArray=[], favoriteDao, callback) {
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
                        pageIndex: --pageIndex,
                        projectModes: [dataArray],
                    })
                } else {
                    // 本次和载入的全部数据量
                    let max = pageIndex * pageSize >= dataArray.length ? dataArray.length : pageSize * pageIndex;
                    projectModels(dataArray.slice(0, max), favoriteDao, data => {
                        dispatch({
                            type: Types.SEARCH_LOAD_MORE_SUCCESS,
                            pageIndex,
                            projectModes: data,
                        })
                    });
                }
            }, 500);
        }
    )
}

