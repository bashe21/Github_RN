import React from 'react';
import {AsyncStorage} from 'react-native';
import langs from '../../res/data/langs';
import keys from '../../res/data/keys';
import ThemeFactory, { ThemeFlags } from '../../res/style/ThemeFactory';

export const FLAG_LANGUAGE = {flag_language: 'language_dao_language', flag_key: 'language_dao_key'};

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
                    this.save(ThemeFlags.Default);
                    result = ThemeFlags.Default;
                    resolve(ThemeFactory.createTheme(result));
                } 
                // else {
                //     try {
                //         resolve(JSON.parse(result));
                //     } catch (error) {
                //         reject(error);
                //     }
                // }
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

    /* 
    保存语言或标签
    */
    save(objectData) {
        let stringData = JSON.stringify(objectData);
        AsyncStorage.setItem(this.flag, stringData, (error, result) => {

        });
    }
}