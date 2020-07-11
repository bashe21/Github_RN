import Types from '../../actions/types'

const defaultState = {};

/* 
popular: {
    java: {
        items,
        isLoading,
    },
    ios: {
        items,
        isLoading,
    }
    ...
}
state树，横向扩展
如何动态的设置store，和动态获取store（难点：storeKey不固定）；
@params state
@params action
@returns {{}}

*/
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.POPULAR_REFRESH_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items: action.items, // 原始数据
                    projectModes: action.projectModes, // 此次加载的数据
                    isLoading: false,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex,
                }
            };
        case Types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                    hideLoadingMore: true,
                }
            };
        case Types.POPULAR_REFRESH_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                }
            };
        case Types.POPULAR_LOAD_MORE_SUCCESS: // 上拉加载成功
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModes: action.projectModes,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex,
                },
            };
        case Types.POPULAR_LOAD_MORE_FAIL: // 上拉加载失败
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    pageIndex: action.pageIndex,
                },
            };
        default:
            return state;
    }
    
}