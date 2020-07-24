import React from 'react';
import {SafeAreaView, View, StyleSheet, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';

export default class SafeAreaViewPlus extends React.Component {
    static propTypes = {
        ...ViewPropTypes,
        topColor: PropTypes.string,
        bottomColor: PropTypes.string,
        enablePlus: PropTypes.bool,
        topInset: PropTypes.bool,
        bottomInset: PropTypes.bool,
    }

    static defaultProps = {
        topColor: 'transparent',
        bottomColor: '#f8f8f8',
        enablePlus: true,
        topInset: true,
        bottomInset: false,
    }

    genSafeAreaViewPlus() {
        const {children, topColor, bottomInset, bottomColor, topInset} = this.props;
        return <View style = {[styles.container, this.props.style]}>
            {this.genTopArea(topColor, topInset)}
            {children}
            {this.genBottomArea(bottomColor, bottomInset)}
        </View>;
    }

    genSafeAreaView() {
        return <SafeAreaView style = {[styles.container, this.props.style]}>
            {this.props.children}
        </SafeAreaView>;
    }

    genTopArea(topColor, topInset) {
        return !DeviceInfo.hasNotch() || !topInset ? null : 
            <View style = {[styles.topArea, {backgroundColor: topColor}]} />;
    }

    genBottomArea(bottomColor, bottomInset) {
        return !DeviceInfo.hasNotch() || !bottomInset ? null : 
            <View style = {[styles.bottomArea, {backgroundColor: bottomColor}]} />;
    }

    render() {
        const {enablePlus} = this.props;
        return enablePlus ? this.genSafeAreaViewPlus() : this.genSafeAreaView();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    topArea: {
        height: 44,
    },

    bottomArea: {
        height: 34,
    }
});