import React from 'react';
import {FlatList, View, ActivityIndicator, Text, StyleSheet, RefreshControl, TouchableOpacity, Platform} from 'react-native';
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
import LanguageDao, { FLAG_LANGUAGE } from '../dao/expand/LanguageDao';
import Featcher from 'react-native-vector-icons/Feather';
import BackPressComponent from '../pages/BackPressComponent';
import NavigationUtils from '../util/NavigationUtils';

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
    },

    statusBar: {
        height: 20,
    },
})

const Tab = createMaterialTopTabNavigator();
class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = props.route.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress});
        this.favoriteDao = new FavoriteDao(FLAG_LANGUAGE.flag_popular);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.isKeyChange = false;
    }

    onBackPress() {
        const {onSearchCacel, onLoadLanguage} = this.props;
        onSearchCacel(); // 退出取消搜索
        this.refs.input.blur();
        NavigationUtils.goBack(this.props.navigation);
        if (this.isKeyChange) {
            onlanguagechange(FLAG_LANGUAGE.flag_key); // 重新加载标签
        }
        return true;
    }

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    loadData(loadMore) {
        const {onSearch, onLoadMoreSearch, search, keys} = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onLoadMoreSearch(search.pageIndex, pageSize, search.items, this.favoriteDao, callback => {
                this.refs.toast.show('没有更多了');
            });
        } else {
            onSearch(inputKey, pageSize,this.serchToken = new Date().getTime(), this.favoriteDao, keys, message => {
                this.refs.toast.show(message);
            });
        }
        
    }

    render() {
        const {isLoading, projectModes, showBottomButton, hideLoadingMore} = this.props;
        const {theme} = this.props.route.params;
        let statusBar = null;
        if (Platform.OS === 'ios') {
            statusBar = <View 
                style = {[styles.statusBar, {backgroundColor: theme.themeColor}]}
            />
        }
        
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
        );
    }
}

const mapPopularStateToProps = state => ({
    keys: state.language.keys,
    theme: state.theme.theme,
    search: state.search,
});

const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
    onSearch: (inputKey, pageSize,token, favoriteDao, popularKey, callback) => dispatch(actions.onSearch(inputKey, pageSize,token, favoriteDao, popularKey, callback)),
    onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callback) => dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callback)),
    onSearchCancel: (token) => dispatch(actions.onSearchCancel(token),
});

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SearchPage);