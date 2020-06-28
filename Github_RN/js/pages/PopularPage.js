import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff',
    },

    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
})

export default class PopularPage extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>PopularPage</Text>
            </View>
        )
    }
}