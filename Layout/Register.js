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
import { URL } from "./HomeScreen";
import axios from "axios";

const Register = (props) => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [sdt, setsdt] = useState("");
  const [pass2, setpass2] = useState("");
  const [pass, setpass] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateSDT = (sdt) => {
    const regex2 = /^(?:\+84|0)([0-9]{9})$/;
    return regex2.test(sdt);
  };

  const addUser = async () => {
    if (name == "" || email == "" || pass == "" || sdt == "") {
      ToastAndroid.show("Không được để trống", 0);
      return;
    }
    if (pass != pass2) {
      ToastAndroid.show("Mật khẩu chưa khớp", 0);
      return;
    }
    if (!validateEmail(email)) {
      ToastAndroid.show("không đúng định dạng email", 0);
      return;
    }
    if (!validateSDT(sdt)) {
      ToastAndroid.show("không đúng định dạng số điện thoại", 0);
      return;
    }

    try {
      const {
        data: { response, type },
        status,
      } = await axios.post(`${URL}/users/register`, {
        name,
        email,
        pass,
        sdt,
      });
      if (status == 200) {
        ToastAndroid.show(response, 0);
        if (type) {
          props.navigation.navigate("LoginScreen");
        }
      }
    } catch (error) {
      console.log(error);
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
              onChangeText={(txt) => {
                setname(txt);
              }}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              onChangeText={(txt) => {
                setemail(txt);
              }}
              autoCapitalize="none"
            />
             <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              onChangeText={(txt) => {
                setsdt(txt);
              }}
              autoCapitalize="none"
              keyboardType='numeric'
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={(txt) => {
                setpass(txt);
              }}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại Password"
              onChangeText={(txt) => {
                setpass2(txt);
              }}
              autoCapitalize="none"
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
    shadowColor: "#ffff", // Màu của bóng
    shadowOffset: {
      width: -10, // Độ lệch bóng theo chiều ngang, âm là bóng từ trái
      height: 5, // Độ lệch bóng theo chiều dọc
    },
    shadowOpacity: 0.1, // Độ mờ của bóng
    shadowRadius: 50, // Bán kính của bóng
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