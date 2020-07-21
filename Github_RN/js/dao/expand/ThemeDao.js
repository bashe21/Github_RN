import React from 'react';
import {AsyncStorage} from 'react-native';
import ThemeFactory, { ThemeFlags } from '../../res/style/ThemeFactory';

const THEME_KEY = 'theme_key';
export default class ThemeDao {
    /* 
    获取当前主题
    */
    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    result = ThemeFlags.Default;
                    this.save(result);
                }
                resolve(ThemeFactory.createTheme(result));
            });
        });
    }

    /* 
    保存主题标识
    */
    save(themeFlag) {
        AsyncStorage.setItem(THEME_KEY, themeFlag, () => {

        });
    }
}