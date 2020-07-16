import ProjectModel from '../mo/ProjectModel';
import Utils from '../util/Utils';

export function handlerData(actionType, dispatch, storeName, data, pageSize, favoriteDao) {
    let fixItems = [];
    if (data && data.data) {
        if (Array.isArray(data.data)) {
            fixItems = data.data;
        } else if (Array.isArray(data.data.items)) {
            fixItems = data.data.items;
        }
    }
    // 第一次要显示的数据
    const showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize); // 第一次要加载的数据
    
    projectModels(showItems, favoriteDao, (projectModes) => {
        dispatch({
            type: actionType,
            items: fixItems,
            projectModes: projectModes,
            storeName,
            pageIndex: 1,
        });
    });
}

export async function projectModels(showItems, favoriteDao, callback) {
    let keys = [];
    try {
        keys = await favoriteDao.getFavoriteKeys();
    } catch (e) {
        console.log(e);
    }
    let projectModels = [];
    for (let i = 0; i < showItems.length; i++) {
        projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)));
    }
    if (typeof callback === 'function') {
        callback(projectModels);
    }
}
