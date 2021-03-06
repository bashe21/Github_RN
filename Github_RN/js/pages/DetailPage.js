import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import NavigatorBar from '../public/NavigatorBar';
import ViewUtils from '../util/ViewUtils';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';
import NavigationUtils from '../util/NavigationUtils';
import {WebView} from 'react-native-webview';
import FavoriteDao from '../dao/expand/FavoriteDao';
import {FLAG_STORAGE} from '../dao/expand/DataStorage';
import share from '../res/data/share';
import ShareUtil from '../util/ShareUtil';
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';

const TRENDING_URL = 'https://github.com/';

export default class DetailPage extends React.Component {
    constructor(props) {
        super(props);
        const {projectMode, flag} = props.route.params;
        const favoriteDao = new FavoriteDao(flag);
        this.favoriteDao = favoriteDao;
        this.url = projectMode.item.html_url || projectMode.item.repo_link;
        const title = projectMode.item.full_name || projectMode.item.repo;
        this.theme = props.route.params.theme;
        this.state = {
            title: title,
            url: this.url,
            canGoBack: false,
            isFavorite: projectMode.isFavorite,
        }
    }
    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            NavigationUtils.goBack(this.props.navigation);
        }
    }

    onNavigationStateChange(navSate) {
        this.setState({
            canGoBack: navSate.canGoBack,
            url: navSate.url,
        });
    } 

    onFavoriteButtonClick() {
        const {projectMode,callback} = this.props.route.params;
        const isFavorite = projectMode.isFavorite = !projectMode.isFavorite;
        this.setState({
            isFavorite: isFavorite,
        });
        callback(isFavorite);
        let key = projectMode.item.repo ? projectMode.item.repo : projectMode.item.id.toString();
        if (projectMode.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectMode.item));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }

    renderRightButton(callback) {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => this.onFavoriteButtonClick()}
                    style = {{flexDirection: 'row'}}
                >
                    <FontAwesome 
                        name = {this.state.isFavorite ? 'star' : 'star-o'}
                        size = {20}
                        style = {{color: 'white', marginRight: 15}}
                    />
                    {ViewUtils.getLeftShareButton(() => {
                        let shareApp = share.share_app;
                        ShareUtil.shareboard(shareApp.content, shareApp.imgUrl, this.url, shareApp.title, [0, 1, 2, 3, 4, 5, 6], (code, message) => {
                            console.log('result:' + code +message);
                        });
                    })}
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let navigatorBar = <NavigatorBar 
            title = {this.state.title}
            leftButton = {ViewUtils.getLeftBackButton(() => this.onBack())}
            style = {this.theme.styles.navBar}
            rightButton = {this.renderRightButton(() => {

            })}
        />;   

        return (
            <SafeAreaViewPlus
                topColor = {this.theme.themeColor}
            >
                {navigatorBar}
                <WebView 
                    ref = {webView => this.webView = webView}
                    startInLoadingState = {true}
                    onNavigationStateChange = {e => this.onNavigationStateChange(e)}
                    source = {{uri: this.state.url}}
                />
            </SafeAreaViewPlus>
            // <View style={styles.container}>
                
            // </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //marginTop: DeviceInfo.hasNotch() ? 30 : 0,
    },
    
    
})