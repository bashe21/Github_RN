import React from 'react';
import {FlatList, View, ActivityIndicator, Text, StyleSheet, RefreshControl} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {connect} from 'react-redux';
import actions from '../actions/index';
import PopularItem from '../public/PopularItem';
import Toast from 'react-native-easy-toast'
import NavigatorBar from '../public/NavigatorBar';
import DeviceInfo from 'react-native-device-info';
import FavoriteDao from '../dao/expand/FavoriteDao';
import {FLAG_STORAGE} from '../dao/expand/DataStorage';
import FavoriteUtil from '../util/FavoriteUtil';
import { onloadFavoriteData } from '../actions/favorite';
import TrendingDiag from '../public/TrendingDiag';
import TrendingItem from '../public/TrendingItem';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

//const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff',
    },

    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },

    tab: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        //marginTop: DeviceInfo.hasNotch() ? 44 : 20,
    },

    indicatorContainer: {
        alignItems: 'center',
    },

    indicator: {
        color: 'red',
        margin: 10,
    }
})
const pageSize = 10; // 设置常量，防止修改
class FavoriteTab extends React.Component {
    constructor(props) {
        super(props);
        const {flag} = props;
        this.storeName = flag;
        this.favoriteDao = new FavoriteDao(flag);
    }

    componentWillMount() {
        this.loadData(false);
    }

    componentDidMount() {
        EventBus.getInstance().addListener(EventTypes.tabPress, this.listener = data => {
            this.loadData(false);
        });
        // const {navigation} = this.props;
        // navigation.addListener(EventTypes.tabPress, (e) => {
        //     this.loadData(false);
        // });
    }
    
    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener);
    }

    loadData(isShowLoading) {
        const {onloadFavoriteData} = this.props;
        onloadFavoriteData(this.storeName, isShowLoading)
    }

    _store() {
        const {favorite} = this.props;
        let store = favorite[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModes: [], // 要显示的数据
            }
        }
        return store;
    }

    onFavorite(item, isFavorite) {
        FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName);
        if (this.storeName === FLAG_STORAGE.flag_popular) {
            EventBus.getInstance().fireEvent(EventTypes.favorite_change_popular);
        } else {
            EventBus.getInstance().fireEvent(EventTypes.favorite_change_trending);
        }
    }

    renderItem(data) {
        const item = data.item;
        const {theme} = this.props;
        const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
        return <Item 
            projectModel = {item}
            onSelect={(callback) => {
                const {navigation} = this.props;
                navigation.navigate('DetailPage', {
                    projectMode: item,
                    flag: this.storeName,
                    callback,
                    theme,
                })
            }}
            onFavorite = {(item, isFavorite) => {
                this.onFavorite(item, isFavorite);
            }}
        />
    }

    render() {
        let store = this._store();
        const {theme} = this.props;
        return (
            <View>
                <FlatList 
                    data = {store.projectModes}
                    renderItem = {data => this.renderItem(data)}
                    keyExtractor = {item => "" + (item.item.id || item.item.repo)}
                    refreshControl = {
                        <RefreshControl 
                            title={'Loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(true)}
                            tintColor={theme.themeColor}
                        />
                    }
                />
                <Toast 
                    ref={'toast'}
                    position={'center'}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    favorite: state.favorite,
});

const mapDispatchToProps = dispatch => ({
    onloadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onloadFavoriteData(storeName, isShowLoading)),
});

// 注意：connect只是个function，并不是非要放在export后面
const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);

const Tab = createMaterialTopTabNavigator();

class FavoritePage extends React.Component {
    constructor(props) {
        super(props);
        this.tabNames = ['最热','趋势'];
        this.flags = [FLAG_STORAGE.flag_popular, FLAG_STORAGE.flag_trending];
        this._screens;
    }

    _screens(tabNames) {
        const tabs = [];
        const {theme} = this.props;
        this.tabNames.forEach((name, index) => {
            tabs.push(<Tab.Screen name={name}>{(props) => <FavoriteTabPage {...props} flag = {this.flags[index]} theme={theme}/>}</Tab.Screen>);
        });
        return tabs;
    }

    render() {
        const {theme} = this.props;

        let statusBar = {
            style: theme.styles.navBar,
            barStyle: 'light-content',
        }

        let navigationBar = <NavigatorBar 
            title = {"收藏"}
            statusBar = {statusBar}
            style = {theme.styles.navBar}
        />

        return (
            <SafeAreaViewPlus
                topColor = {theme.themeColor}
            >
                {navigationBar}
                <Tab.Navigator tabBarOptions={
                {
                    tabStyle:{
                        //width: 200,
                        backgroundColor: 'gray',
                    },
                    scrollEnabled: false,
                    
                }
            }>
                    {this._screens(this.tabNames)}
                </Tab.Navigator>
            </SafeAreaViewPlus>
            // <View style={styles.tab}>
                
            // </View>
            
        );
    }
}

const mapFavoriteStateToProps = state => ({
    theme: state.theme.theme,
});

export default connect(mapFavoriteStateToProps)(FavoritePage);