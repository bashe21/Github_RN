import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import AuthContext from '../navigator/AuthContext'


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default class WelcomePage extends React.Component {
    componentDidMount() {
        this.timer = setTimeout(() => {
            // 跳转到首页
            
            
        }, 200);
    }

    componentWillUnmount() {
        // 页面销毁时，清空计时器
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Welcome to you1!</Text>
            </View>
        )
    }
}
