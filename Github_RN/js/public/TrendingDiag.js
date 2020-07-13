import React from 'react';
import {View, TouchableOpacity, Text, Modal, StyleSheet} from 'react-native';
import { exp } from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../mo/TimeSpan';
import DeviceInfo from 'react-native-device-info';

export const TimeSpans = [new TimeSpan('今 天', 'since=daily'), new TimeSpan('本 周', 'since=weekly'), new TimeSpan('本 月', 'since=monthly'), ]


export default class TrendingDiag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    // state = { // 初始化state的方式2
    //     visible: false,
    // }

    show() {
        this.setState({
            visible: true,
        });
    }

    dismiss() {
        this.setState({
            visible: false,
        });
    }

    render() {
        const {onClose, onSelect} = this.props;
        return (<Modal
            transparent={true}
            visible={this.state.visible}
            onRequestClose={() => this.onClose}
        >
            <TouchableOpacity
                onPress={ () => this.dismiss()}
                style = {styles.container}
            >
                <MaterialIcons 
                    name = {'arrow-drop-up'}
                    size = {36}
                    style = {styles.arrow}
                />

                <View style = {styles.content}>
                    {TimeSpans.map((result, i, arr) => {
                        return <TouchableOpacity 
                            onPress = {() => onSelect(arr[i])}
                            onderlayColor = 'transparent'
                        >
                            <View style = {styles.text_container}>
                                <Text style = {styles.text}>{result.showText}</Text>
                            </View>
                            {i !== TimeSpan.length - 1 ? <View style = {styles.line}/> : null}
                        </TouchableOpacity>
                    })}
                </View>

            </TouchableOpacity>

        </Modal>);
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        alignItems: 'center',
        paddingTop: DeviceInfo.hasNotch() ? 45 : 0,
    },

    arrow: {
        marginTop: 40,
        color: 'white',
        padding: 0,
        margin: -15,
    },

    content: {
        backgroundColor: 'white',
        borderRadius: 3,
        paddingTop: 3,
        paddingBottom: 3,
        marginRight: 3,
    },

    text_container: {
        alignItems: 'center',
        flexDirection: 'row',
    },

    text: {
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
        padding: 8,
        paddingLeft: 26,
        paddingRight: 26,
    },

    line: {
        height: 1,
        backgroundColor: 'darkgray',
    }
})