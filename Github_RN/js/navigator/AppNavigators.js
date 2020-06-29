import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';

const Stack = createStackNavigator();

function AppNavigators() {
    const [isLoading, setIsLoading] = React.useState(true);

    return <NavigationContainer>
        <Stack.Navigator>
            {isLoading} ? 
            (<Stack.Screen name="Welcome" component={WelcomePage} />) : 
            (<Stack.Screen name="Home" component={HomePage} />)
        </Stack.Navigator>
    </NavigationContainer>
}