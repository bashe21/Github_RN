import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default class FavoritePage extends React.Component {
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
                <Text>FavoritePage!</Text>
            </View>
        )
    }
}
