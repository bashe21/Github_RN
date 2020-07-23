export default class Utils {
    /* 
    检查Items是否被收藏
    */
    static checkFavorite(item, keys = []) {
        if (!keys) return false;
        let id = item.id ? item.id : item.repo;
        if (keys.indexOf(id.toString()) !== -1 || keys.indexOf(id) !== -1) {
            return true;
        } else {
            return false;
        }
        // for (let i = 0; len = keys.length; i++) {
        //     if (id.toString() === keys[i]) {
        //         return true;
        //     }
        // }
        // return false; // 这个方式不会进入到这里，不知道为啥！！！
    }

    static checkKeyIsExist(keys, key) {
        for (let i = 0; i < keys.length; i++) {
            const element = keys[i];
            if (element.name.toLowerCase() === key.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
}