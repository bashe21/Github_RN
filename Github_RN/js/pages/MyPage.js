import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Featcher from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigatorBar from '../public/NavigatorBar';
import {MoreMenu} from '../public/MoreMenu';
import GlobalStyles from '../res/style/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import { color } from 'react-native-reanimated';
import NavigationUtils from '../util/NavigationUtils';
import { FLAG_LANGUAGE } from '../dao/expand/LanguageDao';

const THEME_COLOR = '#678';

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        // marginTop: 32,
    },
    about_left: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    item: {
        backgroundColor: 'white',
        padding: 10,
        height: 90,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    groupTitle: {
        marginLeft: 10, 
        marginTop: 10, 
        marginBottom: 5, 
        fontSize: 12, 
        color: 'gray',
    }
})

export default class MyPage extends React.Component {
    getRightButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => {

                }}>
                    <View style = {{padding: 5, marginRight: 8}}>
                        <Featcher 
                            name = {'search'}
                            size = {24}
                            style = {{color: 'white'}}
                        />
                    </View>

                </TouchableOpacity>
            </View>
        )
    }

    getLeftButton(callback) {
        return (
            <TouchableOpacity onPress={callback} style = {{padding: 8, paddingLeft: 12}}>
                <Ionicons 
                    name = {'ios-arrow-back'}
                    size = {26}
                    style = {{color: 'white'}}
                />
            </TouchableOpacity>
        )
    }

    onClick(menu) {
        const {navigation} = this.props;
        let routeName, params = {};
        switch(menu) {
            case MoreMenu.Tutorial:
                routeName = 'WebViewPage';
                params = {
                    url: 'https://coding.m.imooc.com/classindex.html?cid=89',
                    title: '教程',
                }
                break;
            case MoreMenu.About:
                routeName = 'AboutPage';
                break;
            case MoreMenu.Custom_Key:
            case MoreMenu.Custom_Language:
            case MoreMenu.Remove_Key:
                routeName = 'CustomKeyPage';
                params.isRemoveKey = menu === MoreMenu.Remove_Key;
                params.flag = menu !== MoreMenu.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language;
                break;
            case MoreMenu.About_Author:
                routeName = 'AboutMePage';
                params
                break;
        }
        if (routeName) {
            NavigationUtils.goPage(navigation, routeName, params);
        }
        
    }

    getItem(menu) {
        return ViewUtils.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
    }
    
    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content',
        }

        let navigationBar = <NavigatorBar 
            title = {"我的"}
            statusBar = {statusBar}
            style = {{backgroundColor: THEME_COLOR}}
            rightButton = {this.getRightButton()}
            leftButton = {this.getLeftButton()}
        />
        
        return (
            <View style={GlobalStyles.root_container}>
                {navigationBar}
                <ScrollView>
                    <TouchableOpacity
                        onPress = {() => this.onClick(MoreMenu.About)}
                        style = {styles.item}
                    >
                        <View style={styles.about_left}>
                            <Ionicons 
                                name={MoreMenu.About.icon}
                                size={40}
                                style={{
                                    marginRight: 10,
                                    color: THEME_COLOR,
                                }}
                            />
                            <Text>Github Popular</Text>
                        </View>
                        <Ionicons
                            name={'ios-arrow-forward'}
                            size={16}
                            style={{
                                marginLeft: 10,
                                alignSelf: 'center',
                                color: THEME_COLOR,
                            }}
                        />
                        
                    </TouchableOpacity>
                    <View style={GlobalStyles.line}/>

                    {this.getItem(MoreMenu.Tutorial)}
                    {/* {趋势管理} */}
                    <Text style = {styles.groupTitle}>趋势管理</Text>
                    {/* {自定义语言} */}
                    {this.getItem(MoreMenu.Custom_Language)}
                    <View style={GlobalStyles.line}/>
                    {/* {语言排序} */}
                    {this.getItem(MoreMenu.Sort_Language)}

                    {/* {最热管理} */}
                    <Text style = {styles.groupTitle}>最热管理</Text>
                    {/* {自定义标签} */}
                    {this.getItem(MoreMenu.Custom_Key)}
                    {/* {标签排序} */}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MoreMenu.Sort_Key)}
                    {/* {标签移除} */}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MoreMenu.Remove_Key)}

                    {/* {设置管理} */}
                    <Text style = {styles.groupTitle}>设置</Text>
                    {/* {自定义主题} */}
                    {this.getItem(MoreMenu.Custom_Theme)}
                    {/* {关于作者} */}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MoreMenu.About_Author)}
                    {/* {反馈} */}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MoreMenu.Feedback)}

                </ScrollView>
            </View>
        )
    }
}
