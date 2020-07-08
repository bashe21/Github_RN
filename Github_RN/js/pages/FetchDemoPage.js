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
        marginRight: 6,
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
            .then((reponse) => reponse.text())
            .then((jsonText) => {
                this.setState({
                    showText: jsonText,
                })
            })
            .catch((error) => alert(error));
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
                    <Text>{this.state.showText}</Text>
                </View>
            </View>
        )
    }
}
