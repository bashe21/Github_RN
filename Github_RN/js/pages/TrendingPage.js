import React from 'react';
import {FlatList, View, ActivityIndicator, Text, StyleSheet, RefreshControl, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {connect} from 'react-redux';
import actions from '../actions/index';
import TrendingItem from '../public/TrendingItem';
import Toast from 'react-native-easy-toast'
import NavigatorBar from '../public/NavigatorBar';
import DeviceInfo from 'react-native-device-info';
import TrendingDiag, {TimeSpans} from '../public/TrendingDiag';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {FLAG_STORAGE} from '../dao/expand/DataStorage';
import FavoriteUtil from '../util/FavoriteUtil';
import FavoriteDao from '../dao/expand/FavoriteDao';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import { FLAG_LANGUAGE } from '../dao/expand/LanguageDao';
import ArrayUtil from '../util/ArrayUtil';
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';

const URL = 'https://trendings.herokuapp.com/repo';
const QUERY_STR = '?since=weekly';
const THEME_COLOR = '#678';
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

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
class TrendingTab extends React.Component {
    constructor(props) {
        super(props);
        const {name} = props.route;
        this.storeName = name;
        this.timeSpan = props.timeSpan;
        this.isFavoriteChange = false;
    }

    componentWillMount() {
        this.loadData(false);
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan;
            this.loadData(false);
        })
    }

    componentDidMount() {
        EventBus.getInstance().addListener(EventTypes.favorite_change_trending, this.favorite_change_trending = (data) => {
            this.isFavoriteChange = true;
        });
        EventBus.getInstance().addListener(EventTypes.tabPress, this.tabPress = data => {
            if (this.isFavoriteChange) {
                this.loadData(null, true);
            }
        });
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.favorite_change_trending);
        EventBus.getInstance().removeListener(this.tabPress);
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove();
        }
    }

    loadData(loadMore, refreshFavorite) {
        const {onloadTrendingData, onloadMoreTrendingData, onFlushTrendingFavorite} = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onloadMoreTrendingData(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('没有更多了');
            });
        }  else if (refreshFavorite) {
            onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
        } else {
            onloadTrendingData(this.storeName, url, pageSize, favoriteDao);
        }
        
    }

    genFetchUrl(key) {
        return URL + '?' + this.timeSpan.searchText + `&lang=${key}`;
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
        const {trending} = this.props;
        let store = trending[this.storeName];
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
        return <TrendingItem 
            projectModel = {item}
            onSelect={(callback) => {
                const {navigation} = this.props;
                navigation.navigate('DetailPage', {
                    projectMode: item,
                    flag: FLAG_STORAGE.flag_trending,
                    callback,
                    theme,
                })
            }}
            onFavorite = {(item, isFavorite) => {
                FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending);
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
                    keyExtractor = {item => "" + (item.id || item.repo_link)}
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
                                
                            }
                            this.loadData(true);
                            this.canLoadMore = false;
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
    trending: state.trending,
});

const mapDispatchToProps = dispatch => ({
    onloadTrendingData: (storeName, url) => dispatch(actions.onloadTrendingData(storeName, url, pageSize, favoriteDao)),
    onloadMoreTrendingData: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onloadMoreTrendingData(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
    onFlushTrendingFavorite:(storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});

// 注意：connect只是个function，并不是非要放在export后面
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

const Tab = createMaterialTopTabNavigator();

class TrendingPage extends React.Component {
    constructor(props) {
        super(props);
        //this.tabNames = ['Swift','C++','C#','PHP', 'JavaScript'];
        this.state = {
            timeSpan: TimeSpans[0],
        }
        this.prekeys = [];
    }

    componentDidMount() {
        const {onLoadLanguage} = this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_language);
    }

    _screens() {
        const {keys, theme} = this.props;
        if (!this.tab || !ArrayUtil.isEqual(this.prekeys, keys)) {
            const tabs = [];
            this.prekeys = keys;
            keys.forEach((item, index) => { // 优化：如果tab已经存在则不在渲染
                if (item.checked) {
                    tabs.push(<Tab.Screen name={item.name} key={index} >{props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} theme={theme}/>}</Tab.Screen>);
                }
            });
            this.tabs = tabs;
        }
        
        return this.tabs;
    }

    renderTitleView() {
        return (<View>
            <TouchableOpacity
                underlayColor = 'transparent'
                onPress = {() => this.dialog.show()}
            >
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style = {{fontSize: 18, color: '#ffffff', fontWeight: '400'}}>
                        趋势  {this.state.timeSpan.showText}
                    </Text>
                    <MaterialIcons 
                        name = {'arrow-drop-down'}
                        size = {22}
                        style = {{color: 'white'}}
                    />
                </View>
                
            </TouchableOpacity>
        </View>);
    }

    onSelectTimeSpan(tab) {
        this.dialog.dismiss();
        this.setState({
            timeSpan: tab,
        })
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
    }

    renderTrendingDiag() {
        return <TrendingDiag
            ref = {dialog => this.dialog = dialog}
            onSelect = {tab => this.onSelectTimeSpan(tab)}
        />
    }

    render() {
        const {keys, theme} = this.props;

        let statusBar = {
            styles: theme.styles.navBar,
            barStyle: 'light-content',
        }

        let navigationBar = <NavigatorBar 
            titleView = {this.renderTitleView()}
            statusBar = {statusBar}
            style = {theme.styles.navBar}
        />

        const TabNavigator = keys.length > 0 ? (
            <Tab.Navigator tabBarOptions={
                {
                    tabStyle:{
                        width: 200,
                        backgroundColor: 'gray',
                        marginBottom: 2,
                    },
                    scrollEnabled: true,
                    activeTintColor: 'red',
                    inactiveTintColor: 'black',
                    indicatorStyle: {backgroundColor: 'red',height: 2},
                    
                }}
                lazy = {true}
            >
                    {this._screens()}
                </Tab.Navigator>
            ) : null;

        return (
            <SafeAreaViewPlus
                topColor = {theme.themeColor}
            >
                {navigationBar}
                {TabNavigator}
                {this.renderTrendingDiag()}
            </SafeAreaViewPlus>
            // <View style={styles.tab}>
                
            // </View>
            
        );
    }
}
const mapTrendingStateToProps = state => ({
    keys: state.language.languages,
    theme: state.theme.theme,
});

const mapTrendingDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);