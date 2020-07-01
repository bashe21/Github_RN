import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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
    },

    tab: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        marginTop: 44,
    }
})

class PopularTab extends React.Component {
    render() {
        return (
            <View>
                <Text>PopularTab</Text>
            </View>
        )
    }
}

const Tab = createMaterialTopTabNavigator();

export default class PopularPage extends React.Component {
    constructor(props) {
        super(props);
        this.tabNames = ['Tab1','Tab2','Tab3','Tab4'];
        this._screens;
    }

    _screens(tabNames) {
        const tabs = [];
        this.tabNames.forEach(name => {
            tabs.push(<Tab.Screen name={name} component={PopularTab} />);
        });
        return tabs;
    }

    render() {
        return (
            <View style={styles.tab}>
                <Tab.Navigator tabBarOptions={
                {
                    tabStyle:{
                        width: 200,
                        backgroundColor: 'gray',
                    },
                    scrollEnabled: true,
                    
                }
            }>
                    {/* <Tab.Screen name="Tab1" component={PopularTab} />
                    <Tab.Screen name="Tab2" component={PopularTab} /> */}
                    {/* {console.log(this._screens.length)} */}
                    {this._screens(this.tabNames)}
                </Tab.Navigator>
            </View>
            
        );
    }
}