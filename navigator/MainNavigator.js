import { Image } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../Layout/HomeScreen";
import ProfileScreen from "../Layout/ProfileScreen";
import DetailScreen from "../Layout/DetailScreen";
import ClassifyScreen from "../Layout/classify/ClassifyScreen";
import CartScreen from "../Layout/cart/CartScreen";
import SearchScreen from "../Layout/SearchScreen";
import NoticeScreen from "../Layout/NoticeScreen";
import NewProductScreen from "../Layout/NewProductScreen";
import ManageUser from "../Layout/ManageUser";
import PassReset from "../Layout/PassReset";
import Petcare from "../Layout/Petcare";
import Petcare2 from "../Layout/Petcare2";
import Payment from "../Layout/Payment";
import Payment2 from "../Layout/Payment2";
import WebSocketContext from "../Layout/websocket/WebSocketContext";
import HistoryPay from "../Layout/history-pay/HistoryPay";
import AddPaymentMethod from "../Layout/payment/AddPaymentMethod";
import AddShippingAddrees from "../Layout/payment/AddShippingAddrees";
import PaymentMethod from "../Layout/payment/PaymentMethod";
import ShippingAddrees from "../Layout/payment/ShippingAddrees";

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
        name="    "
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

function PetCareWebSocket() {
  return <WebSocketContext child={<Petcare2 />} />;
}

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="ClassifyScreen" component={ClassifyScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="NewProductScreen" component={NewProductScreen} />
      <Stack.Screen name="ManageUser" component={ManageUser} />
      <Stack.Screen name="PassReset" component={PassReset} />
      <Stack.Screen name="Petcare" component={Petcare} />
      <Stack.Screen name="Petcare2" component={PetCareWebSocket} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Payment2" component={Payment2} />
      <Stack.Screen name="history-pay" component={HistoryPay} />
      <Stack.Screen name="ShippingAddrees" component={ShippingAddrees} />
      <Stack.Screen name="AddShippingAddrees" component={AddShippingAddrees} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
      <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethod} />

    </Stack.Navigator>
  );
};

export default MainNavigator;
