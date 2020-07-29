import React, { createContext } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, HeaderTitle} from '@react-navigation/stack';
import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';
import DetailPage from '../pages/DetailPage';
import WebViewPage from '../pages/WebViewPage';
import AboutPage from '../pages/about/AboutPage';
import AboutMePage from '../pages/about/AboutMePage';
import CustomKeyPage from '../pages/CustomKeyPage';
import SortKeyPage from '../pages/SortKeyPage';
import SearchPage from '../pages/SearchPage';
import CodePushPage from '../pages/CodePushPage';
import SplashScreen from 'react-native-splash-screen'

const Stack = createStackNavigator();
const AuthContext = createContext();

function AppNavigators() {
    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isLoading: false,
                        userToken: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isLoading: false,
                        userToken: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
        }
    )

    React.useEffect(
        () => {
            dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
            SplashScreen.hide();
        },
        []
    );

    const authContext = React.useMemo(
        () => ({
            signIn: () => dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'}),
            singOut: () => dispatch({type: 'SIGN_OUT'}),
        }),
        []
    )

    const mainScreens = [
        <Stack.Screen name = 'Homepage' component = {HomePage} options = {{headerShown: false}} key = "Homepage"/>,
        <Stack.Screen name = 'DetailPage' component = {DetailPage} options = {{headerShown: false}} key = "DetailPage"/>,
        <Stack.Screen name = 'WebViewPage' component = {WebViewPage} options = {{headerShown: false}} key = "WebViewPage"/>,
        <Stack.Screen name = 'AboutPage' component = {AboutPage} options = {{headerShown: false}} key = "AboutPage"/>,
        <Stack.Screen name = 'AboutMePage' component = {AboutMePage} options = {{headerShown: false}} key = "AboutMePage"/>,
        <Stack.Screen name = 'CustomKeyPage' component = {CustomKeyPage} options = {{headerShown: false}} key = "CustomKeyPage"/>,
        <Stack.Screen name = 'SortKeyPage' component = {SortKeyPage} options = {{headerShown: false}} key = "SortKeyPage"/>,
        <Stack.Screen name = 'SearchPage' component = {SearchPage} options = {{headerShown: false}} key = "SearchPage"/>,
        <Stack.Screen name = 'CodePushPage' component = {CodePushPage} options = {{headerShown: false}} key = "CodePushPage"/>,
    ]
    

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                <Stack.Navigator>
                    {state.isLoading ? 
                    (<Stack.Screen name="Welcome" component={WelcomePage} />) :
                    (mainScreens)}
                </Stack.Navigator>
            </NavigationContainer>
            {/* {state.isLoading ? <WelcomePage/> : <HomePage />} */}
        </AuthContext.Provider>
    )
}

export default AppNavigators;