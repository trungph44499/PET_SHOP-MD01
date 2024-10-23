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
import React, { useState } from "react";
import { URL } from "./HomeScreen"; // Đảm bảo URL là đường dẫn đến API của bạn
import axios from "axios";
import { auth } from '../Layout/utils/firebaseConfig'; // Import firebase auth
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = (props) => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [pass2, setpass2] = useState("");
  const [pass, setpass] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const addUser = async () => {
    if (name === "" || email === "" || pass === "") {
        ToastAndroid.show("Không được để trống", ToastAndroid.SHORT);
        return;
    }
    if (pass !== pass2) {
        ToastAndroid.show("Mật khẩu chưa khớp", ToastAndroid.SHORT);
        return;
    }
    if (pass.length < 6) { // Kiểm tra độ dài mật khẩu
      ToastAndroid.show("Mật khẩu phải lớn hơn 6 ký tự", ToastAndroid.SHORT);
      return;
  }
    if (!validateEmail(email)) {
        ToastAndroid.show("Không đúng định dạng email", ToastAndroid.SHORT);
        return;
    }

    try {
        // Kiểm tra email đã tồn tại chưa
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0) {
            ToastAndroid.show("Email đã được sử dụng", ToastAndroid.SHORT);
            return;
        }

        // Tạo người dùng với Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Lưu thông tin người dùng vào MongoDB
        const { data } = await axios.post(`${URL}/users/register`, {
            name,
            email,
            pass, 
            uid: user.uid,
        });

        ToastAndroid.show(data.response, ToastAndroid.SHORT);
        props.navigation.navigate("LoginScreen");

    } catch (error) {
        // Hiển thị thông báo lỗi cụ thể
        const errorMessage = error.code === "auth/email-already-in-use" 
            ? "Email đã được sử dụng"
            : error.message;
        
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        console.log(error); // Để kiểm tra lỗi chi tiết trong console
    }
};
  
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <Image
            style={{ width: 210, height: 100, marginBottom: 10, marginTop: 10 }}
            source={require("../Image/logo_1.png")}
          />
          <View
            style={{
              width: "100%",
              gap: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                justifyContent: "center",
                fontSize: 30,
              }}
            >
              Tạo tài khoản
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              onChangeText={setname}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              onChangeText={setemail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={setpass}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại Password"
              secureTextEntry
              onChangeText={setpass2}
            />
            <Text
              style={{ textAlign: "center", marginBottom: 10, marginTop: 10 }}
            >
              Để đăng ký tài khoản, bạn đồng ý
              <Text style={{ textDecorationLine: "underline", color: "green" }}>
                Terms &{"\n"} Conditions
              </Text>
              and
              <Text style={{ textDecorationLine: "underline", color: "green" }}>
                Privacy Policy
              </Text>
            </Text>
            <TouchableOpacity onPress={addUser} style={styles.btn}>
              <Text
                style={{ fontWeight: "bold", fontSize: 20, color: "white" }}
              >
                Đăng ký
              </Text>
            </TouchableOpacity>
            <Text style={{ textAlign: "center", color: "green" }}>
              ________________Hoặc________________
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
              <Text>Tôi đã có tài khoản.</Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("LoginScreen")}
              >
                <Text style={{ color: "green", marginLeft: 3 }}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

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
    width: "90%",
    height: 55,
    borderRadius: 20,
    backgroundColor: "#825640",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ffff",
    shadowOffset: {
      width: -10,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 50,
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
