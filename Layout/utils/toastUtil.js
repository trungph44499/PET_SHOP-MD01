import { ToastAndroid } from "react-native";

export function Toast(message) {
  ToastAndroid.show(message, ToastAndroid.SHORT);
}
