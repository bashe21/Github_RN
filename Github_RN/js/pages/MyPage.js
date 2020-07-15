import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Featcher from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigatorBar from '../public/NavigatorBar';

const THEME_COLOR = '#678';

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        // marginTop: 32,
    }
})

export default class MyPage extends React.Component {
    getRightButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => {

                }}>
                    <View style = {{padding: 5, marginRight: 8}}>
                        <Featcher 
                            name = {'search'}
                            size = {24}
                            style = {{color: 'white'}}
                        />
                    </View>

                </TouchableOpacity>
            </View>
        )
    }

    getLeftButton(callback) {
        return (
            <TouchableOpacity onPress={callback} style = {{padding: 8, paddingLeft: 12}}>
                <Ionicons 
                    name = {'ios-arrow-back'}
                    size = {26}
                    style = {{color: 'white'}}
                />
            </TouchableOpacity>
        )
    }
    
    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content',
        }

        let navigationBar = <NavigatorBar 
            title = {"我的"}
            statusBar = {statusBar}
            style = {{backgroundColor: THEME_COLOR}}
            rightButton = {this.getRightButton()}
            leftButton = {this.getLeftButton()}
        />
        
        return (
            <View style={styles.container}>
                {navigationBar}
                <Text>MyPage!</Text>
            </View>
        )
    }
}
