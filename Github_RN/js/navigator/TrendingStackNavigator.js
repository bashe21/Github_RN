import {createStackNavigator} from '@react-navigation/stack';
import React from 'react'
import TrendingPage from '../pages/TrendingPage';
import FetchDemoPage from '../pages/FetchDemoPage';

const Stack = createStackNavigator();

export default class TrendingNavigator extends React.Component {
    render() {
        return <Stack.Navigator>
            <Stack.Screen name={'TrendingPage'} component={TrendingPage}/>
            <Stack.Screen name={'FetchDemoPage'} component={FetchDemoPage}/>
        </Stack.Navigator>
    }
}