import React, {createContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {NavigationContainer, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PopularPage from './PopularPage';
import TrendingPage from './TrendingPage';
import TrendingStackNavigator from '../navigator/TrendingStackNavigator';
import FavoritePage from './FavoritePage';
import MyPage from './MyPage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {ChangeStyleContext} from '../navigator/ChangeTheme';
import {connect} from 'react-redux';
import { exp } from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    }
})

const theme = {
    style1: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
    },
    style2: {
        activeTintColor: 'blue',
        inactiveTintColor: 'red',
    },
}

function getHeaderTitle(route) {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
    const routeName = getFocusedRouteNameFromRoute(route) ?? '最热';
    switch (routeName) {
      case '最热':
        return '最热';
      case '趋势':
        return '趋势';
      case '收藏':
        return '收藏';
      case '我的':
          return '我的';
    }
  }

class HomePage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            style: theme.style1,
            changeStyle: () => {
                this.state.style === theme.style1 ? this.setState({style: theme.style2}) : this.setState({style: theme.style1})
            },
        };
    }

    // shouldComponentUpdate(nextProps) {
    //     const {navigation} = nextProps;
    //     const {route} = nextProps;
    //     navigation.setOptions({ headerTitle: getHeaderTitle(route) });
    //     return true;
    // }

    render() {
        return (
            <ChangeStyleContext.Provider value={this.state.changeStyle}>
                <NavigationContainer>
                    <Tab.Navigator
                        screenOptions={({route}) => ({
                            tabBarIcon: ({focused, color, size}) => {
                                let iconName;
                                if (route.name === '最热') {
                                    iconName = 'whatshot';
                                    return <MaterialIcons name={iconName} size={size} color={color} />;
                                } else if (route.name === '趋势') {
                                    iconName = 'md-trending-up';
                                    return <Ionicons name={iconName} size={size} color={color} />;
                                } else if (route.name === '收藏') {
                                    iconName = 'favotite';
                                    return <MaterialIcons name={iconName} size={size} color={color} />;
                                } else {
                                    iconName = 'user';
                                    return <Entypo name={iconName} size={size} color={color} />;
                                }
                            },
                        })}
                        tabBarOptions={{
                            // activeTintColor: this.state.style.activeTintColor,
                            // inactiveTintColor: this.state.style.inactiveTintColor,
                            activeTintColor: this.props.theme,
                            inactiveTintColor: 'gray',
                        }}
                >
                        <Tab.Screen name="最热" component={PopularPage} options={{title: '最热'}}/>
                        <Tab.Screen name="趋势" component={TrendingPage} />
                        <Tab.Screen name="收藏" component={FavoritePage} />
                        <Tab.Screen name="我的" component={MyPage} />
                    </Tab.Navigator>
                </NavigationContainer>
            </ChangeStyleContext.Provider>
            
            
        )
    }
}


const mapStateToProps = state => ({
    theme: state.theme.theme,
})

export default connect(mapStateToProps)(HomePage);