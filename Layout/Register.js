import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { URL } from "./HomeScreen";
import axios from "axios";
import { Toast } from "./utils/toastUtil";

const Register = (props) => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [sdt, setsdt] = useState("");
  const [pass, setpass] = useState("");
  const [pass2, setpass2] = useState("");
  const [showPass, setShowPass] = useState(true);
  const [showPass2, setShowPass2] = useState(true);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  function validateName(name) {
    const regex = /[^a-zA-Z\s]/g;
    return regex.test(name);
  }

  const validateSDT = (sdt) => {
    const regex2 = /^(?:\+84|0)([0-9]{9})$/;
    return regex2.test(sdt);
  };

  const addUser = async () => {
    if (name === "" || email === "" || pass === "" || sdt === "") {
      Toast("Cần nhập đủ thông tin");
      return;
    }

    if (pass !== pass2) {
      Toast("Mật khẩu chưa khớp");
      return;
    }

    if (validateName(name)) {
      Toast("Họ tên chưa đúng định dạng");
      return;
    }

    if (!validateEmail(email)) {
      Toast("Không đúng định dạng email");
      return;
    }

    if (!validateSDT(sdt)) {
      Toast("Không đúng định dạng số điện thoại");
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
      if (status === 200) {
        Toast(response);
        if (type) {
          props.navigation.navigate("LoginScreen");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          style={{ width: 210, height: 100, marginBottom: 10, marginTop: 20 }}
          source={require("../Image/logo.png")}
        />
        <View style={styles.formContainer}>
          <Text style={styles.titleText}>Tạo tài khoản</Text>
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
            placeholder="Số điện thoại"
            onChangeText={setsdt}
          />
          <View style={styles.input}>
            <TextInput
              style={{ width: "90%" }}
              secureTextEntry={showPass}
              placeholder="Nhập mật khẩu"
              onChangeText={setpass}
              value={pass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Image
                style={styles.icon}
                source={
                  showPass
                    ? require("../Image/invisible.png")
                    : require("../Image/visible.png")
                }
              />
            </TouchableOpacity>
          </View>

          <View style={styles.input}>
            <TextInput
              style={{ width: "90%" }}
              secureTextEntry={showPass2}
              placeholder="Nhập lại mật khẩu"
              onChangeText={setpass2}
              value={pass2}
            />
            <TouchableOpacity onPress={() => setShowPass2(!showPass2)}>
              <Image
                style={styles.icon}
                source={
                  showPass2
                    ? require("../Image/invisible.png")
                    : require("../Image/visible.png")
                }
              />
            </TouchableOpacity>
          </View>
          <Text style={{ textAlign: "center", marginBottom: 5, marginTop: 5 }}>
            Để đăng ký tài khoản, bạn đồng ý
            <Text
              style={{
                textDecorationLine: "underline",
                color: "green",
              }}
            >
              Terms &{"\n"} Conditions
            </Text>
            and
            <Text style={{ textDecorationLine: "underline", color: "green" }}>
              Privacy Policy
            </Text>
          </Text>
          <TouchableOpacity onPress={addUser} style={styles.btn}>
            <Text style={styles.btnText}>Đăng ký</Text>
          </TouchableOpacity>
          <Text style={styles.dividerText}>
            ________________Hoặc________________
          </Text>
          <View style={styles.socialIcons}>
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
              <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingBottom: 20,
  },
  formContainer: {
    width: "100%",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 30,
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
  icon: {
    width: 25,
    height: 25,
    marginTop: 1,
  },
  termsText: {
    textAlign: "center",
    marginBottom: 5,
    marginTop: 5,
  },
  linkText: {
    textDecorationLine: "underline",
    color: "green",
  },
  btn: {
    width: "90%",
    height: 55,
    borderRadius: 20,
    backgroundColor: "#825640",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  dividerText: {
    textAlign: "center",
    color: "green",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: 50,
    height: 50,
  },
  text: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "green",
    marginLeft: 3,
  },
});
