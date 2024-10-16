import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Layout/HomeScreen';
import ProfileScreen from '../Layout/ProfileScreen';
import DetailProduct from '../Layout/DetailProduct';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Home() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: '#D17842',
            tabBarInactiveBackgroundColor: 'white',
            tabBarActiveBackgroundColor: 'white',
        }}>
            <Tab.Screen name=' ' component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Image style = {{width: 20, height: 20}}
                    source={require('../Image/home1.png')} tintColor={color} />
                }} />

            <Tab.Screen name='  ' component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Image style = {{width: 20, height: 20}}
                    source={require('../Image/search1.png')} tintColor={color} />
                }} />

            <Tab.Screen name='   ' component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Image style = {{width: 20, height: 20}}
                    source={require('../Image/notification1.png')} tintColor={color} />
                }} />

            <Tab.Screen name='     ' component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Image style = {{width: 20, height: 20}}
                    source={require('../Image/profile1.png')} tintColor={color} />
                }} />
        </Tab.Navigator>
    )
}


const MainNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='DetailProduct' component={DetailProduct} />

        </Stack.Navigator>
    )
}

export default MainNavigator
