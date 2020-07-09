import React from 'react';
import {StyleSheet, View, TextInput, Button, Text, AsyncStorage} from 'react-native';

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
        height: 30,
    }
})

const KEY = 'zyx';

export default class AsyncStorageDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showText: '',
        }
    }

    addData() {
        AsyncStorage.setItem(KEY,this.value, () => {
            
        });
    }

    removeData() {
        AsyncStorage.removeItem(KEY);
    }

    getData() {
        AsyncStorage.getItem(KEY, (error, value) => {
            this.setState({
                showText: value,
            })
        })
    }

    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.input_container}>
                    <TextInput style={styles.input} onChangeText={text => this.value = text} />
                    <View style={styles.button_content}>
                        <Button 
                            title={'add Data'} 
                            onPress = {
                                () => {
                                    this.addData();
                                }
                            }
                        />
                        <Button 
                            title={'remove data'} 
                            onPress = {
                                () => {
                                    this.removeData();
                                }
                            }
                        />
                        <Button 
                            title={'get data'} 
                            onPress = {
                                () => {
                                    this.getData();
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
