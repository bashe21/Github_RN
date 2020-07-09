import React from 'react';
import {StyleSheet, View, TextInput, Button, Text} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    input: {
        flex: 1,
        borderColor: 'black',
        borderWidth: 1,
        marginRight: 10,
        height: 30,
    },
    input_container: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})

export default class FetchDemoPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showText:'',
        }
    }

    loadData() {
        const url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Network request response is not ok');
            })
            .then((jsonText) => {
                this.setState({
                    showText: jsonText,
                })
            })
            .catch((error) => {
                this.setState({
                    showText: error,
                })
            });
    }

    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.input_container}>
                    <TextInput style={styles.input} onChangeText={text => this.searchKey = text} />
                    <Button 
                        title={'Fetch data'} 
                        onPress = {
                            () => {
                                this.loadData();
                            }
                        }
                    />
                </View>
                <Text>{this.state.showText}</Text>
            </View>
        )
    }
}
