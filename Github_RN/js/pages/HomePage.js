import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PopularPage from './PopularPage';
import TrendingPage from './TrendingPage';
import FavoritePage from './FavoritePage';
import MyPage from './MyPage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default class HomePage extends React.Component {
    componentDidMount() {
        this.timer = setTimeout(() => {
            // 跳转到首页

        }, 200);
    }

    componentWillUnmount() {
        // 页面销毁时，清空计时器
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
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
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen name="最热" component={PopularPage} options={{title: '最热'}}/>
                <Tab.Screen name="趋势" component={TrendingPage} />
                <Tab.Screen name="收藏" component={FavoritePage} />
                <Tab.Screen name="我的" component={MyPage} />
            </Tab.Navigator>
        )
    }
}
