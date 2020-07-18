import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking, Clipboard} from 'react-native';
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
import Toast from 'react-native-easy-toast';

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

export default class AboutMePage extends React.Component {
    constructor(props) {
        super(props);
        this.params = props.route.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: props.navigation,
            flag_about: FLAG_ABOUT.flag_about_me,
        }, data => this.setState({...data}));
        this.state = {
            data: config,
            showTutarial: true,
            showBlog: false,
            showQQ: false,
            showContact: false,
        }
    }

    onClick(tab) {
        if (!tab) return;
        const {navigation} = this.props;
        if (tab.url) {
            NavigationUtils.goPage(navigation, 'WebViewPage', {
                title: tab.title,
                url: tab.url,
            });
            return;
        } 

        if (tab.account && tab.account.indexOf('@') > -1) {
            let url = 'mainto://' + tab.account;
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
            return;
        }

        if (tab.account) {
            Clipboard.setString(tab.account);
            this.toast.show(tab.title + tab.account + '已复制到剪切板');
        }
        
    }

    getItem(menu) {
        return ViewUtils.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
    }

    _item(data, isShow, key) {
        return (ViewUtils.getSettingItem(() => {
            this.setState({
                [key]: !this.state[key],
            });
        }, data.name,THEME_COLOR, Ionicons, data.icon, isShow ? 'ios-arrow-up' : 'ios-arrow-down'));
    }

    /* 
    显示列表数据
    */
    renderItem(dict, isShowAccount) {
        if (!dict) return null;
        const content = [];
        for (let i in dict) {
            let title = isShowAccount ? (dict[i].title + ':' + dict[i].account) : dict[i].title;
            content.push(
                <View kye={i}>
                    {ViewUtils.getSettingItem(() => this.onClick(dict[i]), title, THEME_COLOR)}
                    <View style={GlobalStyles.line}/>
                </View>
            )
        }
        return content;
    }
    
    render() {
        const content = <View>
            {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutarial, 'showTutarial')}
            <View style={GlobalStyles.line}/>
            {this.state.showTutarial ? this.renderItem(this.state.data.aboutMe.Tutorial.items) : null}

            {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
            <View style={GlobalStyles.line}/>
            {this.state.showBlog ? this.renderItem(this.state.data.aboutMe.Blog.items) : null}

            {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
            <View style={GlobalStyles.line}/>
            {this.state.showQQ ? this.renderItem(this.state.data.aboutMe.QQ.items) : null}

            {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
            <View style={GlobalStyles.line}/>
            {this.state.showContact ? this.renderItem(this.state.data.aboutMe.Contact.items, true) : null}

        </View>
        return <View style = {{flex: 1}}>
            {this.aboutCommon.render(content, this.state.data.author)}
            <Toast 
                ref = {toast => this.toast = toast}
                position = {'center'}
            />
        </View>
    }
}
