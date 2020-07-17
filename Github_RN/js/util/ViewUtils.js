import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { exp } from 'react-native-reanimated';


export default class ViewUtils {
    /* 
    获取左侧返回按钮
    */
    static getLeftBackButton(callback) {
        return <TouchableOpacity
            style={{padding: 8, paddingLeft: 12}}
            onPress = {callback}
        >
            <Ionicons 
                name={'ios-arrow-back'}
                size={26}
                style={{color: 'white'}}
            />

        </TouchableOpacity>
    }

    /* 
    获取右侧分享按钮
    */
    static getLeftShareButton(callback) {
        return <TouchableOpacity
            underlayColor = {'transparent'}
            onPress = {callback}
        >
            <Ionicons 
                name={'md-share'}
                size={20}
                style={{color: 'white', opacity: 0.9, marginRight: 10}}
            />

        </TouchableOpacity>
    }

    /* 
    获取设置页的Item
    @params callback 单击item的回调
    @params text 显示的文本
    @params color 图标着色
    @params Icons react-native-vector-icons组件
    @params icon 左侧图标
    @params expandableIcon 右侧图片
    return {XML}
    
    */
    static getSettingItem(callback, text, color, Icons, icon, expandableIcon) {
        return (
            <TouchableOpacity
                onPress = {callback}
                style = {styles.setting_item_container}
            >
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    {
                        (Icons && icon) ? (
                            <Icons 
                            name={icon}
                            size={16}
                            style={{color: color, marginRight: 10}}/>
                        ) : 
                        <View style = {{opacity: 1, width: 16, height: 16, marginRight: 10,}}/>  
                    }
                    <Text>{text}</Text>
                </View>
                <Ionicons
                    name={expandableIcon ? expandableIcon : 'ios-arrow-forward'}
                    size={16}
                    style={{
                        marginLeft: 10,
                        alignSelf: 'center',
                        color: color || 'black',
                    }}
                />
            </TouchableOpacity>
        )
    }


    /* 
    获取设置页面的Item
    @params callback 单击item的回调
    @params menu @MoreMenu
    @parmams color 图标着色
    @params expandableIcon 右侧图标
    @return {XML}
    */
    static getMenuItem(callback, menu, color, expandableIcon) {
        return ViewUtils.getSettingItem(callback, menu.name, color, menu.Icons, menu.icon, expandableIcon);
    }
}


const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    }
})