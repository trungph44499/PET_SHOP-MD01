import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import MainNavigator from './MainNavigator';
import Register from '../Layout/Register';
import LoginScreen from '../Layout/LoginScreen';


const AuthNavigator = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='LoginScreen' component={LoginScreen}/>
            <Stack.Screen name='Register' component={Register}/>
            <Stack.Screen name='Main' component={MainNavigator}/>
        </Stack.Navigator>
    )
}

export default AuthNavigator

const styles = StyleSheet.create({})