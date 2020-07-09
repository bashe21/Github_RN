import {createStackNavigator} from '@react-navigation/stack';
import React from 'react'
import TrendingPage from '../pages/TrendingPage';
import FetchDemoPage from '../pages/FetchDemoPage';
import AsyncStorageDemo from '../pages/AsyncStorageDemo';

const Stack = createStackNavigator();

export default class TrendingNavigator extends React.Component {
    render() {
        return <Stack.Navigator>
            <Stack.Screen name={'TrendingPage'} component={TrendingPage}/>
            <Stack.Screen name={'FetchDemoPage'} component={FetchDemoPage}/>
            <Stack.Screen name={'AsyncStorageDemo'} component={AsyncStorageDemo}/>
        </Stack.Navigator>
    }
}