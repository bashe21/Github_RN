import Types from '../../actions/types'

const defaultState = {
    showText: '搜索',
    items: [],
    isLoading: false,
    projectModes: [],// 需要显示的数据
    hideLoadingMore: true, // 默认隐藏加载更多
    showBottomButtom: false,
}

export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.SEARCH_REFRESH:
            return {
                ...state,
                isLoading: true,
                hideLoadingMore: true,
                showBottomButtom: false,
                showText: '取消',
            };
        case Types.SEARCH_REFRESH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                hideLoadingMore: false,
                showBottomButton: action.showBottomButton,
                items: action.items,
                projectModes: action.projectModes,
                pageIndex: action.pageIndex,
                showText: '搜索',
                inputKey: action.inputKey,
            };
        case Types.SEARCH_FAIL:
            return {
                ...state,
                isLoading: false,
                showText: '搜索',
            };
        case Types.SEARCH_CANCEL:
            return {
                ...state,
                isLoading: false,
                showText: '搜索',
            };
        case Types.SEARCH_LOAD_MORE_SUCCESS: // 上拉加载成功
            return {
                ...state,
                projectModes: action.projectModes,
                hideLoadingMore: false,
                pageIndex: action.pageIndex,
            };
        case Types.SEARCH_LOAD_MORE_FAIL: // 上拉加载失败
            return {
                ...state,
                hideLoadingMore: true,
                pageIndex: action.pageIndex,
            };
        default:
            return state;
    }
    
}