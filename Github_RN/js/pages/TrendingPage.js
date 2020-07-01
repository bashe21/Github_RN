import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {ChangeStyleContext} from '../navigator/ChangeTheme';

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default class TrendingPage extends React.Component {
    static contextType = ChangeStyleContext;
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
                <Text>TrendingPage!</Text>
                <Button title="changeTabbarLabel" onPress={
                    () => {
                        const {navigation} = this.props;
                        navigation.setOptions({tabBarLabel: 'hello1'});
                    }
                } />
                <Button title="changeTabbarStyle" onPress={this.context} />
            </View>
        )
    }
}
