import React from 'react';
import {FlatList, View, ActivityIndicator, Text, StyleSheet, RefreshControl, TouchableOpacity, Platform, TextInput} from 'react-native';
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
import GlobalStyles from '../res/style/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import Utils from '../util/Utils';
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const pageSize = 10; // 设为常量，防止修改

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#f5fcff',
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
        //height: 20,
    },
    
    bottomButton: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
        height: 40,
        position: 'absolute',
        left: 10,
        top: DeviceInfo.hasNotch() ? (GlobalStyles.window_height - 45 - 32) : (GlobalStyles.window_height - 45),
        right: 10,
        borderRadius: 3,
        
    },

    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    textInput: {
        flex: 1, 
        height: (Platform.OS === 'ios') ? 26 : 36,
        borderWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 3,
        opacity: 0.7,
        color: 'white',
    },

    title: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
    }

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
        const {onSearchCancel, onLoadLanguage} = this.props;
        onSearchCancel(); // 退出取消搜索
        this.refs.input.blur();
        NavigationUtils.goBack(this.props.navigation);
        if (this.isKeyChange) {
            onLoadLanguage(FLAG_LANGUAGE.flag_key); // 重新加载标签
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
        if (loadMore) {
            onLoadMoreSearch(++search.pageIndex, pageSize, search.items, this.favoriteDao, callback => {
                this.toast.show('没有更多了');
            });
        } else {
            onSearch(this.inputKey, pageSize,this.searchToken = new Date().getTime(), this.favoriteDao, keys, message => {
                this.toast.show(message);
            });
        }
        
    }

    genIndicator(hideLoadingMore) {
        return hideLoadingMore ? null : 
        (<View style={styles.indicatorContainer}>
            <ActivityIndicator 
                style={styles.indicator}
            />
            <Text>正在加载更多</Text>
        </View>);
    }

    /* 
    添加标签
    */
    saveKey() {
        const {keys} = this.props;
        let key = this.inputKey;
        if (Utils.checkKeyIsExist(keys,key)) {
            this.toast.show(key + '已经存在');
        } else {
            key = {
                'path': key,
                'name': key,
                'checked': true
            };
            keys.unshift(key); // 将key添加到数组的开头
            this.languageDao.save(keys);
            this.toast.show(key.name + '保存成功');
            this.isKeyChange = true;
        }
    }

    onRightButtonClick() {
        const {onSearchCancel, search} = this.props;
        if (search.showText === '搜索') {
            this.loadData(false);
        } else {
            onSearchCancel(this.searchToken);
        }
    }

    renderNavBar() {
        const {showText, inputKey} = this.props.search;
        const {theme} = this.params;
        const placeholder = inputKey || '请输入';
        let backButton = ViewUtils.getLeftBackButton(() => this.onBackPress());
        let inputView = <TextInput 
            ref = 'input'
            placeholder = {placeholder}
            onChangeText = {text => this.inputKey = text}
            style = {styles.textInput}
        />

        let rightButton = <TouchableOpacity 
            onPress = {() => {
                this.refs.input.blur(); // 收起键盘
                this.onRightButtonClick();
            }}
        >
            <View style = {{marginRight: 10}}>
        <Text style = {styles.title}>{showText}</Text>
            </View>
        </TouchableOpacity>
        
        return <View style = {{
            backgroundColor: theme.themeColor,
            flexDirection: 'row',
            alignItems: 'center',
            height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android,
            paddingTop: 0,
        }}>
            {backButton}
            {inputView}
            {rightButton}
        </View>
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
        const {isLoading, projectModes, showBottomButton, hideLoadingMore} = this.props.search;
        const {theme} = this.props.route.params;
        let statusBar = null;
        if (Platform.OS === 'ios') {
            statusBar = <View 
                style = {[styles.statusBar, {backgroundColor: theme.themeColor}]}
            />
        }
        
        let listView = !isLoading ? (
            <FlatList 
                    data = {projectModes}
                    renderItem = {data => this.renderItem(data)}
                    keyExtractor = {item => "" + item.item.id}
                    refreshControl = {
                        <RefreshControl 
                            title={'Loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={isLoading}
                            onRefresh={() => this.loadData(false)}
                            tintColor={theme.themeColor}
                        />
                    }
                    contentInset = {
                        {
                            bottom: 45,
                        }
                    }
                    ListFooterComponent={() => this.genIndicator(hideLoadingMore)}
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
        ) : null;
        
        let bottomButton = showBottomButton ? (
            <TouchableOpacity
                style = {[styles.bottomButton, {backgroundColor: theme.themeColor}]}
                onPress = {() => {
                    this.saveKey();
                }}
            >
                <View style = {{justifyContent: 'center'}}>
                    <Text style = {styles.title}>朕收下了</Text>
                </View>
            </TouchableOpacity>
        ) : null;

        let indicatorView = isLoading ? 
                <ActivityIndicator 
                    style = {styles.centering}
                    size = 'large'
                    animating = {isLoading}
                /> : null;

        let resutltView = <View style = {{flex: 1}}>
            {indicatorView}
            {listView}
        </View>;

        return (
            <SafeAreaViewPlus
                topColor = {theme.themeColor}
            >
                {statusBar}
                {this.renderNavBar()}
                {resutltView}
                {bottomButton}
                <Toast ref = {toast => this.toast = toast}/>
            </SafeAreaViewPlus>
            // <View style = {styles.container}>
                
            // </View>
        );
    }
}

const mapStateToProps = state => ({
    keys: state.language.keys,
    theme: state.theme.theme,
    search: state.search,
});

const mapDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
    onSearch: (inputKey, pageSize,token, favoriteDao, popularKey, callback) => dispatch(actions.onloadSearch(inputKey, pageSize,token, favoriteDao, popularKey, callback)),
    onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callback) => dispatch(actions.onloadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callback)),
    onSearchCancel: (token) => dispatch(actions.onSearchCancel(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);