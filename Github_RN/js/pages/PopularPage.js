import React from 'react';
import {FlatList, View, ActivityIndicator, Text, StyleSheet, RefreshControl, TouchableOpacity} from 'react-native';
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
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import { FLAG_LANGUAGE } from '../dao/expand/LanguageDao';
import Featcher from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationUtils from '../util/NavigationUtils';
import AnalyticsUtil from '../util/AnalyticsUtil';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

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
class PopularTab extends React.Component {
    constructor(props) {
        super(props);
        const {name} = props.route;
        this.storeName = name;
        this.isFavoriteChange = false;
    }

    componentWillMount() {
        this.loadData(false);
    }

    componentDidMount() {
        EventBus.getInstance().addListener(EventTypes.favorite_change_popular, this.favorite_change_popular = (data) => {
            this.isFavoriteChange = true;
        });
        EventBus.getInstance().addListener(EventTypes.tabPress, this.tabPress = data => {
            if (this.isFavoriteChange) {
                this.loadData(null, true);
            }
        });
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.favorite_change_popular);
        EventBus.getInstance().removeListener(this.tabPress);
    }

    loadData(loadMore, refreshFavorite) {
        const {onLoadPopularData, onLoadMorePopularData, onFlushPopularFavorite} = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onLoadMorePopularData(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('没有更多了');
            });
        } else if (refreshFavorite) {
            onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
        } else {
            onLoadPopularData(this.storeName, url, pageSize, favoriteDao);
        }
        
    }

    genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }

    genIndicator() {
        let store = this._store();
        return store.hideLoadingMore ? null : 
        (<View style={styles.indicatorContainer}>
            <ActivityIndicator 
                style={styles.indicator}
            />
            <Text>正在加载更多</Text>
        </View>);
    }

    _store() {
        const {popular} = this.props;
        let store = popular[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModes: [], // 要显示的数据
                hideLoadingMore: true, // 默认隐藏加载更多
            }
        }
        return store;
    }

    renderItem(data) {
        const item = data.item;
        const {theme} = this.props;
        return <PopularItem 
            projectModel = {item}
            onSelect={(callback) => {
                const {navigation} = this.props;
                navigation.navigate('DetailPage', {
                    projectMode: item,
                    flag: FLAG_STORAGE.flag_popular,
                    callback,
                    theme,
                })
            }}
            onFavorite = {(item, isFavorite) => {
                FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular);
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
                    keyExtractor = {item => "" + item.item.id}
                    refreshControl = {
                        <RefreshControl 
                            title={'Loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(false)}
                            tintColor={theme.themeColor}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached = {() => {
                        console.log('----onEndReached----') //注意初始化的时候会被调用
                        setTimeout(() => { // 避免onEndReached比onMomentumScrollBegin先调用问题
                            if (this.canLoadMore) {
                                this.loadData(true);
                                this.canLoadMore = false;
                            }
                        }, 100);
                        
                    }}
                    onEndReachedThreshold = {0.5}
                    onMomentumScrollBegin = {() => { // 
                        this.canLoadMore = true; // fix上述初始化就调用onEndReached问题 使得滚动后才调用 onEndReached
                        console.log('----onMomentumScrollBegin----')
                    }}
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
    popular: state.popular,
});

const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onloadPopularData(storeName, url, pageSize, favoriteDao)),
    onLoadMorePopularData: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onloadMorePopularData(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});

// 注意：connect只是个function，并不是非要放在export后面
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

const Tab = createMaterialTopTabNavigator();
class PopularPage extends React.Component {
    constructor(props) {
        super(props);
        //this.tabNames = ['Java','Android','iOS','React', 'React-Native', 'PHP'];
    }

    componentDidMount() {
        const {onLoadLanguage} = this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_key);
    }

    _screens() {
        const tabs = [];
        const {keys, theme} = this.props;
        keys.forEach((item, index) => {
            if (item.checked) {
            tabs.push(<Tab.Screen name={item.name} key={index}>{props => <PopularTabPage {...props} theme={theme}/>}</Tab.Screen>);
            }
            
        });
        return tabs;
    }

    getRightButton() {
        const {theme} = this.props;
        return (
            <View>
                <TouchableOpacity onPress={() => {
                    NavigationUtils.goPage(this.props.navigation, 'SearchPage', {
                        theme,
                    });
                    AnalyticsUtil.onEvent('SearchButtonClick');
                }}>
                    <View >
                        <Ionicons 
                            name = {'ios-search'}
                            size = {24}
                            style = {{
                                color: 'white',
                                marginRight: 8,
                                alignSelf: 'center',
                            }}
                        />
                    </View>

                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const {keys, theme} = this.props;
        
        let statusBar = {
            style: theme.styles.navBar,
            barStyle: 'light-content',
        }

        let navigationBar = <NavigatorBar 
            title = {"最热"}
            statusBar = {statusBar}
            style = {theme.styles.navBar}
            rightButton = {this.getRightButton()}
        />

        const TabNavigator = keys.length > 0 ? (
        <Tab.Navigator tabBarOptions={
                {
                    tabStyle:{
                        width: 200,
                        backgroundColor: 'gray',
                    },
                    scrollEnabled: true,
                    
                }
            }
            lazy = {true}
        >
                {this._screens()}
            </Tab.Navigator>) : null;

        return (
            <View style={styles.tab}>
                {navigationBar}
                {TabNavigator}
            </View>
            
        );
    }
}

const mapPopularStateToProps = state => ({
    keys: state.language.keys,
    theme: state.theme.theme,
});

const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage);