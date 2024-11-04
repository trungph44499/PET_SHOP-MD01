import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL } from "./HomeScreen";
import axios from "axios";

const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(true);
  const [checkRemember, setCheckRemember] = useState(false);

  useEffect(() => {
    const checkUserLogin = async () => {
      const savedUser = await AsyncStorage.getItem("User");
      const rememberMe = await AsyncStorage.getItem("RememberMe");

      if (savedUser && rememberMe === "true") {
        // Nếu có thông tin người dùng và đã tick "Nhớ tài khoản", chuyển đến Main
        /* khi tick vào nút nhớ tài khoản trước khi đăng nhập
              thì lần đăng nhập tiếp theo sẽ chuyển vào màn home luôn */
        props.navigation.navigate("Main");
      }
    };
    checkUserLogin();
  }, []);

  const CheckLogin = async () => {
    if (email === "") {
      ToastAndroid.show("Email không được bỏ trống", ToastAndroid.SHORT);
      return;
    }
    if (pass === "") {
      ToastAndroid.show("Pass không được bỏ trống", ToastAndroid.SHORT);
      return;
    }

    try {
      const {
        data: { response, type },
        status,
      } = await axios.post(`${URL}/users/login`, { email, pass });
      if (status == 200) {
        ToastAndroid.show(response, ToastAndroid.SHORT);
        if (type) {
          await AsyncStorage.setItem("@UserLogin", email);
          if (checkRemember) {
            await AsyncStorage.setItem("User", email);
            await AsyncStorage.setItem("RememberMe", "true"); // Lưu trạng thái "Nhớ tài khoản"
          } else {
            await AsyncStorage.removeItem("RememberMe"); // Xóa nếu không tick
          }
          props.navigation.navigate("Main");
        }
        return;
      }
      ToastAndroid.show("Error login", ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        "Đã có lỗi xảy ra, vui lòng thử lại",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <Image
            style={{ width: 400, height: 200 }}
            source={require("../Image/logo_1.png")}
          />
          <View style={{ gap: 10 }}>
            <Text style={styles.titleText}>Chào mừng bạn</Text>
            <Text style={styles.subtitleText}>Đăng nhập tài khoản</Text>
            <View style={styles.input}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="Nhập email"
                onChangeText={(txt) => setEmail(txt)}
                value={email}
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%" }}
                secureTextEntry={showPass}
                placeholder="Nhập mật khẩu"
                onChangeText={(txt) => setPass(txt)}
                value={pass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Image
                  style={{ width: 25, height: 25, marginTop: 1 }}
                  source={
                    showPass
                      ? require("../Image/visible.png")
                      : require("../Image/invisible.png")
                  }
                />
              </TouchableOpacity>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => setCheckRemember(!checkRemember)}
                >
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={
                      checkRemember
                        ? require("../Image/check.png")
                        : require("../Image/circle.png")
                    }
                  />
                </TouchableOpacity>
                <Text style={{ marginLeft: 10 }}>Nhớ tài khoản</Text>
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("ForgotPassword")}
              >
                <Text style={{ color: "green", fontWeight: "bold" }}>
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btn} onPress={CheckLogin}>
              <Text
                style={{ fontWeight: "bold", fontSize: 20, color: "white" }}
              >
                Đăng nhập
              </Text>
            </TouchableOpacity>
            <Text style={{ textAlign: "center", color: "green" }}>
              ______________Hoặc________________
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity>
                <Image
                  style={styles.image}
                  source={require("../Image/google.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  style={[styles.image, { marginLeft: 40 }]}
                  source={require("../Image/facebook.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.text}>
              <Text>Bạn không có tài khoản?</Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("Register")}
              >
                <Text style={{ color: "green", marginLeft: 5 }}>
                  Tạo tài khoản
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFDF8",
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    width: "90%",
    height: 55,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    borderRadius: 20,
    backgroundColor: "#825640",
    padding: 15,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    justifyContent: "space-around",
    alignItems: "center",
  },
  text: {
    flexDirection: "row",
    justifyContent: "center",
  },
  titleText: {
    fontWeight: "900",
    textAlign: "center",
    fontSize: 35,
    marginTop: 30,
  },
  subtitleText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "400",
  },
});

export default LoginScreen;
