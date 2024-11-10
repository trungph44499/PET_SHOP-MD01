import { useEffect, useState } from "react";
import AuthNavigator from "./navigator/AuthNavigator";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "./Layout/WelcomeScreen";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [checkWelcome, setcheckWelcome] = useState(true);
  const [checkRemember, setCheckRemember] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const savedUser = await AsyncStorage.getItem("User");
      const rememberMe = await AsyncStorage.getItem("RememberMe");

      if (savedUser && rememberMe === "true") {
        // Nếu có thông tin người dùng và đã tick "Nhớ tài khoản", chuyển đến Main
        /* khi tick vào nút nhớ tài khoản trước khi đăng nhập
              thì lần đăng nhập tiếp theo sẽ chuyển vào màn home luôn */
        setCheckRemember(true);
      }

      setcheckWelcome(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Provider store={store}>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)" />
      {checkWelcome ? (
        <WelcomeScreen />
      ) : (
        <NavigationContainer>
          <AuthNavigator remember={checkRemember} />
        </NavigationContainer>
      )}
    </Provider>
  );
}
