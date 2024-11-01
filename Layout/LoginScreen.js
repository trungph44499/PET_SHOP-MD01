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
import CheckBoxCustom from "./components/CheckBoxCustom";

const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(true);
  const [checkRemember, setCheckRemember] = useState(false);

  // Load email and password from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const storedEmail = await AsyncStorage.getItem("User");
      const storedPassword = await AsyncStorage.getItem("Password");
      if (storedEmail) {
        setEmail(storedEmail);
        setCheckRemember(true);
      }
      if (storedPassword) {
        setPass(storedPassword);
      }
    };
    loadUserData();
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
      if (status === 200) {
        ToastAndroid.show(response, ToastAndroid.SHORT);
        if (type) {
          await AsyncStorage.setItem("@UserLogin", email);
          if (checkRemember) {
            await AsyncStorage.setItem("User", email);
            await AsyncStorage.setItem("Password", pass); // Lưu mật khẩu nếu nhớ tài khoản
          } else {
            await AsyncStorage.removeItem("Password"); // Xóa mật khẩu nếu không nhớ tài khoản
          }
          props.navigation.navigate("Main");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.container}>
          <Image style={{ width: 400, height: 200 }} source={require("../Image/logo_1.png")} />
          <View style={{ gap: 10 }}>
            <Text style={{ fontWeight: "900", textAlign: "center", fontSize: 35, marginTop: 30 }}>
              Chào mừng bạn
            </Text>
            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "400" }}>
              Đăng nhập tài khoản
            </Text>
            <View style={styles.input}>
              <TextInput
                style={{ width: "100%" }}
                placeholder="Nhập email"
                onChangeText={(txt) => setEmail(txt)}
                value={email || ""}
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%" }}
                secureTextEntry={showPass}
                placeholder="Nhập mật khẩu"
                onChangeText={(txt) => setPass(txt)}
                value={pass || ""}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Image
                  style={{ width: 25, height: 25, marginTop: 1 }}
                  source={showPass ? require("../Image/visible.png") : require("../Image/invisible.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CheckBoxCustom
                  onChangeCheckBox={() => setCheckRemember(!checkRemember)}
                  value={checkRemember}
                />
                <Text style={{ marginLeft: 10 }}>Nhớ tài khoản</Text>
              </View>
              <TouchableOpacity onPress={() => props.navigation.navigate("ForgotPassword")}>
                <Text style={{ color: "green", fontWeight: "bold" }}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => CheckLogin()}>
              <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>Đăng nhập</Text>
            </TouchableOpacity>
            <Text style={{ textAlign: "center", color: "green" }}> ________________Hoặc________________ </Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity>
                <Image style={styles.image} source={require("../Image/google.png")} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image style={[styles.image, { marginLeft: 40 }]} source={require("../Image/facebook.png")} />
              </TouchableOpacity>
            </View>
            <View style={styles.text}>
              <Text>Bạn không có tài khoản?</Text>
              <TouchableOpacity onPress={() => props.navigation.navigate("Register")}>
                <Text style={{ color: "green", marginLeft: 5 }}>Tạo tài khoản</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
});
