import React from 'react';
import {View, TouchableOpacity, TouchableHighlight, Text, Modal, StyleSheet, ScrollView, Platform} from 'react-native';
import { exp } from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../mo/TimeSpan';
import DeviceInfo from 'react-native-device-info';
import ThemeDao from '../dao/expand/ThemeDao';
import GlobalStyles from '../res/style/GlobalStyles';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import ThemeFactory, { ThemeFlags } from '../res/style/ThemeFactory';
import { onThemeInit, onThemeChange } from '../actions/theme';
import { connect } from 'react-redux';
import actions from '../actions';

export const TimeSpans = [new TimeSpan('今 天', 'since=daily'), new TimeSpan('本 周', 'since=weekly'), new TimeSpan('本 月', 'since=monthly'), ]


class CustomTheme extends React.Component {
    constructor(props) {
        super(props);
        this.themeDao = new ThemeDao();
    }

    onSelectTheme(themeKey) {
        this.props.onclose();
        this.themeDao.save(ThemeFlags[themeKey]);
        const {onThemeChange} = this.props;
        onThemeChange(ThemeFactory.createTheme(ThemeFlags[themeKey]));
    }
    /* 
    创建主题
    */
    getThemeItem(themeKey) {
        return (
            <TouchableHighlight
                style = {{flex: 1}}
                underlayColor = 'white'
                onPress = {() => this.onSelectTheme(themeKey)}
            >
                <View style = {[{backgroundColor: ThemeFlags[themeKey]}, styles.themeItem]}>
                    <Text style = {styles.themeText}>{themeKey}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    renderThemeItems() {
        let views = [];
        for (let i = 0, keys = Object.keys(ThemeFlags), l = keys.length; i < l; i += 3) {
            const key1 = keys[i], key2 = keys[i + 1], key3 = keys[i + 2];
            views.push(
                <View key = {i} style = {{flexDirection: 'row'}}>
                    {this.getThemeItem(key1)}
                    {this.getThemeItem(key2)}
                    {this.getThemeItem(key3)}
                </View>
            )
        }
        return views;

    }

    renderContentView() {
        <Modal 
            animationType = {'slied'}
            transparent = {true}
            visible = {this.props.visible}
            onRequestClose = {() => {
                this.props.onclose();
            }}
        >
            <View style = {styles.modalContainer}>
                <ScrollView>
                    {this.renderThemeItems()}
                </ScrollView>
            </View>
        </Modal>
    }

    render() {
        let view = this.props.visible ? <View style = {GlobalStyles.root_container}>
            {this.renderContentView()}
        </View> : null;
        return view;
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    onThemeChange: (theme) => dispatch(actions.onThemeChange(theme)),
});

export default connect(mapDispatchToProps, mapDispatchToProps)(CustomTheme);

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1, 
        margin: 10,
        marginTop: Platform.OS === 'ios' ? 20 : 10,
        backgroundColor: 'white',
        borderRadius: 3,
        shadowColor: 'gray',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        padding: 3,
    },

    themeItem: {
        flex: 1, 
        height: 120, 
        margin: 3, 
        padding: 3,
        borderRadius: 2, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
    }
})