import React, { createContext } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, HeaderTitle} from '@react-navigation/stack';
import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';
import DetailPage from '../pages/DetailPage';

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
        <Stack.Screen name = 'Homepage' component = {HomePage} options = {{headerShown: false}}/>,
        <Stack.Screen name = 'DetailPage' component = {DetailPage} options = {{headerShown: false}}/>,
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