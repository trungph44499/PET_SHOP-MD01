import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../Layout/HomeScreen";
import ProfileScreen from "../Layout/ProfileScreen";
import DetailScreen from "../Layout/DetailScreen";
import ClassifyScreen from "../Layout/classify/ClassifyScreen";
import CartScreen from "../Layout/CartScreen";
import SearchScreen from '../Layout/SearchScreen';
import NoticeScreen from '../Layout/NoticeScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Home() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#D17842",
        tabBarInactiveBackgroundColor: "white",
        tabBarActiveBackgroundColor: "white",
      }}
    >
      <Tab.Screen
        name=" "
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../Image/home1.png")}
              tintColor={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="  "
        component={SearchScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../Image/search1.png")}
              tintColor={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="   "
        component={NoticeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../Image/notification1.png")}
              tintColor={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="     "
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../Image/profile1.png")}
              tintColor={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="ClassifyScreen" component={ClassifyScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name='SearchScreen' component={SearchScreen} />
      <Stack.Screen name='NoticeScreen' component={NoticeScreen} />

    </Stack.Navigator>
  );
};

export default MainNavigator;
