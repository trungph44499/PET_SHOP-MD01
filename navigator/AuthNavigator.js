import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./MainNavigator";
import Register from "../Layout/Register";
import LoginScreen from "../Layout/LoginScreen";
import ForgotPassword from "../Layout/ForgotPassword";
import ResetPassword from "../Layout/ResetPassword";
import OtpScreen from "../Layout/OtpScreen";

const AuthNavigator = ({ remember }) => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={remember ? "Main" : "LoginScreen"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
