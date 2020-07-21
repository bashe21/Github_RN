import React from 'react';
import {FlatList, View, ActivityIndicator, Text, StyleSheet, RefreshControl, ScrollView, Alert, TouchableHighlight, Dimensions} from 'react-native';
import { NavigationContainer, ThemeProvider } from '@react-navigation/native';
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
import BackPressComponent from './BackPressComponent';
import ViewUtils from '../util/ViewUtils';
import CheckBox from 'react-native-check-box'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationUtils from '../util/NavigationUtils';
import ArrayUtil from '../util/ArrayUtil';
import {DragSortableView} from 'react-native-drag-sort';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

const {width} = Dimensions.get('window')

const parentWidth = width
const childrenWidth = width
const childrenHeight = 48

const Tab = createMaterialTopTabNavigator();
class SortKeyPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.route.params;
        this.backPress = new BackPressComponent((e) => this.onBackPress(e));
        this.languageDao = new LanguageDao(this.params.flag);
        this.theme = props.route.params.theme;
        this.state = {
            checkedArray: SortKeyPage._keys(props),
            scrollEnabled: true,
        };
    }

    onBackPress(e) {
        this.onBack();
        return true;
    }

    componentDidMount() {
        this.backPress.componentDidMount();
        if (SortKeyPage._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props;
            onLoadLanguage(this.params.flag);
        }
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    /* 
    新版React方法
    */
    static getDerivedStateFromProms(nextProps, prevState) {
        const checkedArray = SortKeyPage._keys(nextProps, null, prevState)
        if (prevState.keys !== checkedArray) {
            return {
                checkedArray: checkedArray
            }
        }
        return null;
    }

    // componentWillReceiveProps(nextProps) {
    //     if (this.props.projectModel.isFavorite !== nextProps.projectModel.isFavorite) {
    //         this.setState({
    //             isFavorite: nextProps.projectModel.isFavorite,
    //         })
    //     }
    // }
    /* 
    获取标签
    @params props
    @params state 移除标签时水用
    */
    static _keys(props, state) {
        // 如果state中有checkedArray,则使用state中的checkedArray
        if (state && state.checkedArray && state.checkedArray.length > 0) {
            return state.checkedArray;
        }
        // 否则从原始数据中获取checkedArray
        const flag = SortKeyPage._flag(props);
        let dataArray = props.language[flag] || [];
        let keys = [];
        for (let i = 0, len = dataArray.length; i < len; i++) {
            let data = dataArray[i];
            if (data.checked) keys.push(data);
        }
        return keys;
    }

    static _flag(props) {
        const {flag} = props.route.params;
        return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
    }

    onSave(hasChecked) {
        const {navigation} = this.props;
        if (!hasChecked) {
            // 如果没有排序则直接返回
            if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
                NavigationUtils.goBack(navigation);
                return;
            }
        }
        // todao 保存排序后的数据
        // 获取排序后的数据
        const resultArray = this.getSortResult();
        // 更新本地数据
        this.languageDao.save(resultArray);
        const {onLoadLanguage} = this.props;
        // 更新store
        onLoadLanguage(this.params.flag);
        NavigationUtils.goBack(navigation);
    }
    
    /* 
    获取排序后的结果
    */
    getSortResult() {
        const flag = SortKeyPage._flag(this.props);
        // 从原始数据中复制一份数据出来，以便对这份数据进行排序
        let sortResultArray = ArrayUtil.clone(this.props.language[flag]);
        // 获取排序之前的排序顺序
        const originalCheckedArray = SortKeyPage._keys(this.props);
        // 遍历排序之前的数据，用排序后的数据checkedArray 进行替换
        for (let i = 0, l = originalCheckedArray.length; i < l; i++) {
            let item = originalCheckedArray[i];
            // 找到要替换的元素所在位置
            let index = this.props.language[flag].indexOf(item);
            // 进行替换
            sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
        return sortResultArray;
    }

    onBack() {
        const {navigation} = this.props;
        if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
            Alert.alert('提示', '要保存修改吗?',[
                {
                    text: '否', 
                    onPress: () => {
                        NavigationUtils.goBack(navigation);
                    }
                },
                {
                    text: '是',
                    onPress: () => {
                        this.onSave(true);
                    }
                }
            ])
        } else {
            NavigationUtils.goBack(navigation);
        }
    }

    renderItem(item,index) {
        return (
        <View style = {item.checked ? styles.item : styles.hidden}>
            <View style={styles.item_children}>
                <MaterialCommunityIcons 
                    name = {'sort'}
                    size = {16}
                    style = {{marginLeft: 10, marginRight: 10, color: ThemeProvider.themColor}}
                />
                <Text>{item.name}</Text>
            </View>
        </View>
        )
        
    }

    render() {
        let title = FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';

        let statusBar = {
            style: this.theme.styles.navBar,
            barStyle: 'light-content',
        }

        let navigationBar = <NavigatorBar 
            title = {title}
            statusBar = {statusBar}
            style = {this.theme.styles.navBar}
            rightButton = {ViewUtils.getRightButton('保存', () => this.onSave())}
            leftButton = {ViewUtils.getLeftBackButton(() => this.onBack())}
        />

        return (
            <View style={styles.container}>
                {navigationBar}
                <ScrollView
                    ref={(scrollView)=> this.scrollView = scrollView}
                    scrollEnabled = {this.state.scrollEnabled}
                    style={styles.container}
                >
                    <DragSortableView
                        dataSource={this.state.checkedArray}
                        parentWidth={parentWidth}
                        childrenWidth= {childrenWidth}
                        childrenHeight={childrenHeight}
                        keyExtractor={(item,index)=> item.name}
                        renderItem={(item,index)=>{
                            return this.renderItem(item,index)
                        }}
                        onDragStart={(startIndex)=>{
                            this.setState({
                                scrollEnabled: false
                            })
                        }}
                        onDragEnd={(startIndex, endIndex)=>{
                            this.setState({
                                scrollEnabled: true,
                            })
                            this.state.checkedArray.splice(endIndex, 0, this.state.checkedArray.splice(startIndex, 1)[0])
                        }}
                        onDataChange = {(data)=>{
                            if (data.length != this.state.checkedArray.length) {
                                this.setState({
                                    data: data
                                })
                            }
                        }}
                    />
                </ScrollView>
                
            </View>
        )
    }
}

const mapSortKeyStateToProps = state => ({
    language: state.language,
});

const mapSortKeyDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

export default connect(mapSortKeyStateToProps, mapSortKeyDispatchToProps)(SortKeyPage);


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#f0f0f0',
    },
    line: {
        flex: 1, 
        height: 0.3,
        backgroundColor: 'darkgray',
    },
    item: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        borderBottomColor: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center',
        width: childrenWidth,
        height: childrenHeight,
        alignItems: 'center',
    },
    hidden: {
        height: 0,
    },
    item_children: {
        height: childrenHeight-4,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginLeft: 10,
        marginRight: 10,
        width: childrenWidth,
    },
})