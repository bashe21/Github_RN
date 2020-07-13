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

const URL = 'https://trendings.herokuapp.com/repo';
const QUERY_STR = '?since=weekly';
const THEME_COLOR = '#678';
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';

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
        marginTop: DeviceInfo.hasNotch() ? 44 : 20,
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
    }

    componentWillMount() {
        this.loadData(false);
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan;
            this.loadData(false);
        })
    }

    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove();
        }
    }

    loadData(loadMore) {
        const {onloadTrendingData, onloadMoreTrendingData} = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onloadMoreTrendingData(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
                this.refs.toast.show('没有更多了');
            });
        } else {
            onloadTrendingData(this.storeName, url, pageSize);
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
        return <TrendingItem 
            item={item}
            onSelect={() => {

            }}
        />
    }

    render() {
        let store = this._store();
        return (
            <View>
                <FlatList 
                    data = {store.projectModes}
                    renderItem = {data => this.renderItem(data)}
                    keyExtractor = {item => "" + (item.id || item.repo_link)}
                    refreshControl = {
                        <RefreshControl 
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            colors={[{THEME_COLOR}]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(false)}
                            tintColor={THEME_COLOR}
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
    onloadTrendingData: (storeName, url) => dispatch(actions.onloadTrendingData(storeName, url, pageSize)),
    onloadMoreTrendingData: (storeName, pageIndex, pageSize, items, callback) => dispatch(actions.onloadMoreTrendingData(storeName, pageIndex, pageSize, items, callback)),
});

// 注意：connect只是个function，并不是非要放在export后面
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

const Tab = createMaterialTopTabNavigator();

export default class TrendingPage extends React.Component {
    constructor(props) {
        super(props);
        this.tabNames = ['Swift','C++','C#','PHP', 'JavaScript'];
        this._screens;
        this.state = {
            timeSpan: TimeSpans[0],
        }
    }

    _screens(tabNames) {
        const tabs = [];
        if (this.tabs) return this.tabs;
        this.tabNames.forEach((name, i) => {
            tabs.push(<Tab.Screen name={name} component={(props) => <TrendingTabPage {...props} timeSpan={this.state.timeSpan}/>} key={i} />);
        });
        this.tabs = tabs;
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
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content',
        }

        let navigationBar = <NavigatorBar 
            titleView = {this.renderTitleView()}
            statusBar = {statusBar}
            style = {{backgroundColor: THEME_COLOR}}
        />

        return (
            <View style={styles.tab}>
                {navigationBar}
                <Tab.Navigator tabBarOptions={
                {
                    tabStyle:{
                        width: 200,
                        backgroundColor: 'gray',
                    },
                    scrollEnabled: true,
                    activeTintColor: 'red',
                    inactiveTintColor: 'black'
                    
                }}
            >
                    {this._screens(this.tabNames)}
                </Tab.Navigator>
                {this.renderTrendingDiag()}
            </View>
            
        );
    }
}