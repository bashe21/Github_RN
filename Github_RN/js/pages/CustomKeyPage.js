import React from 'react';
import {FlatList, View, ActivityIndicator, Text, StyleSheet, RefreshControl, ScrollView, Alert} from 'react-native';
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
import BackPressComponent from './BackPressComponent';
import ViewUtils from '../util/ViewUtils';
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationUtils from '../util/NavigationUtils';
import ArrayUtil from '../util/ArrayUtil';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);


const Tab = createMaterialTopTabNavigator();
class CustomKeyPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.route.params;
        this.backPress = new BackPressComponent((e) => this.onBackPress(e));
        this.changeValues = [];
        this.isRemoveKey = this.params.isRemoveKey;
        this.languageDao = new LanguageDao(this.params.flag);
        this.state = {
            keys: [],
        };
    }

    onBackPress(e) {
        this.onBack();
        return true;
    }

    componentDidMount() {
        this.backPress.componentDidMount();
        if (CustomKeyPage._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props;
            onLoadLanguage(this.params.flag);
        }
        this.setState({
            keys: CustomKeyPage._keys(this.props),
        })
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    /* 
    新版React方法
    */
    static getDerivedStateFromProms(nextProps, prevState) {
        if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
            return {
                keys: CustomKeyPage._keys(nextProps, null, prevState)
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
    @params original 移除标签时使用，是否从props获取原始对的标签
    @params state 移除标签时水用
    */
    static _keys(props, original, state) {
        const {flag, isRemoveKey} = props.route.params;
        let key = (flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages');
        if (isRemoveKey && !original) { 
            // 如果state中的keys为空则从props中取
            return state && state.keys && state.keyes.length !== 0 || props.language[key].map(val => {
                return { // 注意不能直接改props，copy一份
                    ...val,
                    checked: false,
                }
            })
        } else {
            return props.language[key];
        }
    }


    onSave() {
        const {navigation} = this.props;
        if (this.changeValues.length === 0) {
            NavigationUtils.goBack(navigation);
            return;
        }

        let keys;
        if (this.isRemoveKey) { // 如果是标签的特殊处理
            for (let i = 0, l = this.changeValues.length; i < l; i++) {
                ArrayUtil.remove(keys = CustomKeyPage._keys(this.props, true), this.changeValues[i], 'name');
            }
        }
        
        // 更新本地数据
        this.languageDao.save(keys || this.state.keys);
        const {onLoadLanguage} = this.props;
        // 更新store
        onLoadLanguage(this.params.flag);
        NavigationUtils.goBack(navigation);
    }

    onBack() {
        const {navigation} = this.props;
        if (this.changeValues.length > 0) {
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
                        this.onSave();
                    }
                }
            ])
        } else {
            NavigationUtils.goBack(navigation);
        }
    }

    renderView() {
        let dataArray = this.state.keys;
        if (!dataArray || dataArray.length === 0) return;
        let len = dataArray.length;
        let views = [];
        for (let i = 0, l = len; i < l; i += 2) {
            views.push(
              <View key = {i}>
                  <View style = {styles.item}>
                        {this.renderCheckBox(dataArray[i], i)}
                        {i+1 < len && this.renderCheckBox(dataArray[i+1], i+1)}
                  </View>
                  <View style = {styles.line} />
              </View>  
            );
        }
        return views;
    }

    onClick(data, index) {
        data.checked = !data.checked;
        ArrayUtil.updataArray(this.changeValues, data);
        this.state.keys[index] = data; // 更新state以便显示
        this.setState({
            keys: this.state.keys,
        })
    }

    _checkedImage(checked) {

    }

    renderCheckBox(data, index) {
        return <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={()=>this.onClick(data, index)}
            isChecked={data.checked}
            leftText={data.name}
            checkedImage = {this._checkedImage(true)}
            unCheckedImage = {this._checkedImage(false)}
        />
    }

    render() {
        let title = this.isRemoveKey ? '标签移除' : '自定义标签';
        title = (this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title);
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';

        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content',
        }

        let navigationBar = <NavigatorBar 
            title = {title}
            statusBar = {statusBar}
            style = {{backgroundColor: THEME_COLOR}}
            rightButton = {ViewUtils.getRightButton(rightButtonTitle, () => this.onSave())}
            leftButton = {ViewUtils.getLeftBackButton(() => this.onBack())}
        />

        return (
            <View>
                {navigationBar}
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>
        )
    }
}

const mapCustomKeyStateToProps = state => ({
    language: state.language,
});

const mapCustomKeyDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

export default connect(mapCustomKeyStateToProps, mapCustomKeyDispatchToProps)(CustomKeyPage);


const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    item: {
        flexDirection: 'row',
    },
    line: {
        flex: 1, 
        height: 0.3,
        backgroundColor: 'darkgray',
    }
})