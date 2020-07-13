import {createStackNavigator} from '@react-navigation/stack';
import React from 'react'
import PopularPage from '../pages/PopularPage';
import DetailPage from '../pages/DetailPage';


const Stack = createStackNavigator();

export default class PopularNavigator extends React.Component {
    render() {
        return <Stack.Navigator>
            <Stack.Screen name={'PopularPage'} component={PopularPage}/>
            <Stack.Screen name={'DetailPage'} component={DetailPage}/>
        </Stack.Navigator>
    }
}