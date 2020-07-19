import React from 'react';
import {FlatList, View, ActivityIndicator, Text, StyleSheet, RefreshControl, ScrollView} from 'react-native';
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
        this.isRemoveKey = !this.params.isRemoveKey;
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
        let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
        if (isRemoveKey && !original) {

        } else {
            return props.language[key];
        }
    }


    onSave() {

    }

    onBack() {
        const {navigation} = this.props;
        NavigationUtils.goBack(navigation);
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
        const {theme} = {theme} = this.params;
        return (
            <Ionicons 
                name = {checked ? 'ios-checkbox' : 'md-square-outline'}
                size = {20}
                style = {{
                    color: THEME_COLOR,
                }}
            />
        );
    }

    _checkedImage(checked) {

    }

    renderCheckBox(data, index) {
        return <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={()=>this.onClick(data, index)}
            isChecked={this.state.isChecked}
            leftText={data.name}
            checkedImage = {this._checkedImage(true)}
            unCheckedImage = {this._checkedImage(false)}
        />
    }

    render() {
        let title = this.isRemoveKey ? '标签移除' : '自定义标签';
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content',
        }

        let navigationBar = <NavigatorBar 
            title = {title}
            statusBar = {statusBar}
            style = {{backgroundColor: THEME_COLOR}}
            rightButton = {ViewUtils.getRightButton(title, () => this.onSave())}
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

const mapPopularStateToProps = state => ({
    language: state.language,
});

const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage);


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