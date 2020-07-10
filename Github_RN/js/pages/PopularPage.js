import React from 'react';
import {FlatList, View, Text, StyleSheet, RefreshControl} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {connect} from 'react-redux';
import actions from '../actions/index';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = 'red';

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
    constructor(props) {
        super(props);
        const {name} = props.route;
        this.storeName = name;
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        const {onLoadPopularData} = this.props;
        const url = this.genFetchUrl(this.storeName);
        onLoadPopularData(this.storeName, url);
    }

    genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }

    renderItem(data) {
        const item = data.item;
        return <View style={{marginTop: 10}}>
            <Text style={{backgroundColor: '#faa'}}>
                {JSON.stringify(item)}
            </Text>
        </View>
    }

    render() {
        const {popular} = this.props;
        let store = popular[this.storeName]; // 动态获取state
        if (!store) {
            store =  {
                items: [],
                isLoading: false,
            }
        }
        return (
            <View>
                <FlatList 
                    data = {store.items}
                    renderItem = {data => this.renderItem(data)}
                    keyExtractor = {item => "" + item.id}
                    refreshControl = {
                        <RefreshControl 
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            colors={[{THEME_COLOR}]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={THEME_COLOR}
                        />
                    }
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    popular: state.popular,
});

const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url) => dispatch(actions.onloadPopularData(storeName, url)),
});


const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

const Tab = createMaterialTopTabNavigator();

export default class PopularPage extends React.Component {
    constructor(props) {
        super(props);
        this.tabNames = ['Java','Android','iOS','React', 'React-Native', 'PHP'];
        this._screens;
    }

    _screens(tabNames) {
        const tabs = [];
        this.tabNames.forEach(name => {
            tabs.push(<Tab.Screen name={name} component={PopularTabPage} />);
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