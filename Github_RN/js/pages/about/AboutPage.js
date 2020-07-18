import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking} from 'react-native';
import Featcher from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigatorBar from '../../public/NavigatorBar';
import {MoreMenu} from '../../public/MoreMenu';
import GlobalStyles from '../../res/style/GlobalStyles';
import ViewUtils from '../../util/ViewUtils';
import { color } from 'react-native-reanimated';
import AboutCommon from './AboutCommon';
import config from '../../res/data/config'
import NavigationUtils from '../../util/NavigationUtils';

const THEME_COLOR = '#678';
const FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'};

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

export default class AboutPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = props.route.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: props.navigation,
            flag_about: FLAG_ABOUT.flag_about,
        }, data => this.setState({...data}));
        this.state = {
            data: config,
        }
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
                };
                break;
            case MoreMenu.About_Author:
                routeName = 'AboutMePage';
                break;
            case MoreMenu.Feedback:
                const url = 'mailto://crazycodebody@gmail.com';
                Linking.canOpenURL(url)
                    .then((supported) => {
                        if (!supported) {
                            console.log('Cant\'t handle url:' + url);
                        } else {
                            Linking.openURL(url);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
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
        const content = <View>
            {this.getItem(MoreMenu.Tutorial)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MoreMenu.About_Author)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MoreMenu.Feedback)}
        </View>
        return this.aboutCommon.render(content, this.state.data.app);
    }
}
