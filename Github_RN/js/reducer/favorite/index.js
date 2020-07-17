import Types from '../../actions/types'

const defaultState = {};

/* 
favorite: {
    popular: {
        projectModes,
        isLoading,
    },
    trending: {
        projectModes,
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
        case Types.FAVORITE_LOAD_DATA: // 获取数据
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                }
            };
        case Types.FAVORITE_LOAD_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    projectModes: action.projectModes, // 此次要展示的数据
                }
            };
        case Types.FAVORITE_LOAD_FAIL: // 加载失败
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                }
            };
        default:
            return state;
    }
    
}