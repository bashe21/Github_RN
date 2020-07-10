import React from 'react';
import {StyleSheet, View, TextInput, Button, Text, AsyncStorage} from 'react-native';
import DataStorage from '../dao/expand/DataStorage'
import DataStore from '../dao/expand/DataStorage';

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderColor: 'black',
        borderWidth: 1,
        marginRight: 10,
        height: 30,
        width: 300,
    },
    input_container: {
        alignItems: 'center',
        // justifyContent: 'flex-start',
        height: 100,
    },
    button_content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottom_view: {
        // height: 30,
    }
})

const KEY = 'zyx';

export default class DataStorageDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showText: '',
        }
        this.dataStore = new DataStore();
    }

    loadData() {
        const url = `https://api.github.com/search/repositories?q=${this.value}`;
        this.dataStore.fetchData(url).then((data) => {
            const showText = `首次获取数据时间:${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`;
            this.setState({
                showText: showText,
            });
        }).catch((error) => {
            console.log(error);
        })
    }

    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.input_container}>
                    <TextInput style={styles.input} onChangeText={text => this.value = text} />
                    <View style={styles.button_content}>
                        <Button 
                            title={'get data'} 
                            onPress = {
                                () => {
                                    this.loadData();
                                }
                            }
                        />
                    </View>
                    
                </View>
                <Text style={styles.bottom_view}>{this.state.showText}</Text>
            </View>
        )
    }
}
