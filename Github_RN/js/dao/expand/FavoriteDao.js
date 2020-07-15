import React from 'react';
import {AsyncStorage} from 'react-native';

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao extends React.Component {
    constructor(flag) {
        super(flag);
        this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
    }

    /* 
    收藏项目，保存收藏的项目
    @params key 项目id
    @parmas value 收藏的项目
    @params callback
    */
    saveFavoriteItem(key, value, callback) {
        AsyncStorage.setItem(key, value, (error, result) => {
            if (!error) { // 更新favorite的key
                this.updateFavoriteKeys(key, true);
            }
        })
    }

    /* 
    更新favorite key集合
    @params key
    @params isAdd true 添加  false 删除
    */
    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (error, result) => {
            if (!error) {
                let favoriteKeys = [];
                if (result) {
                    favoriteKeys = JSON.parse(result);
                }
                let index = favoriteKeys.indexOf(key);
                if (isAdd) {
                    if (index === -1) {
                        favoriteKeys.push(key);
                    }
                }  else {
                    if (index !== -1) {
                        favoriteKeys.splice(index, 1)
                    }
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys))
            }
        })
    }

    /* 
    
    获取收藏的Respository对应的key
    @return {Promise}
    */
    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(error);
                    }
                } else {
                    reject(error);
                }
            })
        })
    }

    /* 
    取消收藏，移除已经收藏的项目
    @params key项目 id
    */
    removeFavoriteItem(key) {
        AsyncStorage.removeItem(key, (error, result) => {
            if (!error) {
                this.updateFavoriteKeys(key, false);
            }
        })
    }

    /* 
    获取所有收藏的项目
    return {Promise}
    */
    getAllItems() {
        return new Promise((resolve, reject) => {
            this.getFavoriteKeys().then((keys) => {
                let items = [];
                if (keys) {
                    AsyncStorage.multiGet(keys, (error, stores) => {
                        try {
                            stores.map((result, i, store) => {
                                // 将二维数组转换维一维数组
                                let key = store[i][0];
                                let value = store[i][1];
                                if (value) {
                                    items.push(JSON.parse(value));
                                }
                            });
                            resolve(items);
                        } catch (e) {
                            reject(e);
                        }
                    })
                } else {
                    resolve(items);
                }
            }).catch((e) => {
                reject(e);
            })
        })
    }
}