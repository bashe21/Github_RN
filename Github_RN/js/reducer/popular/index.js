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
        case Types.LOAD_POPULAR_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...[action.storeName],
                    items: action.data,
                    isLoading: false,
                }
            };
        case Types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...[action.storeName],
                    isLoading: true,
                }
            };
        case Types.LOAD_POPULAR_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...[action.storeName],
                    isLoading: false,
                }
            };
        default:
            return state;
    }
    
}