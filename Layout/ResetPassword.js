import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { URL } from "./HomeScreen";

const ResetPassword = ({ route, navigation }) => { // Thay đổi đây
  const { email } = route.params; // Nhận email từ params
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    if (newPassword === "") {
      ToastAndroid.show("Vui lòng nhập mật khẩu mới", ToastAndroid.SHORT);
      return;
    }

    try {
      const response = await axios.post(`${URL}/users/reset-password`, {
        email,
        password: newPassword,
      });
      ToastAndroid.show(response.data.response, ToastAndroid.SHORT);
      navigation.navigate("LoginScreen"); // Điều hướng về màn hình đăng nhập
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Đã xảy ra lỗi, vui lòng thử lại", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.container}>
          <Text style={styles.title}>Đặt lại mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry
            onChangeText={setNewPassword}
            value={newPassword}
          />
          <TouchableOpacity style={styles.btn} onPress={handleResetPassword}>
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "white" }}>Đặt lại mật khẩu</Text>
          </TouchableOpacity>
          <Text
            onPress={() => navigation.navigate("LoginScreen")}
            style={styles.btnLogin}>Trở lại trang đăng nhập
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFDF8",
  },
  title: {
    fontWeight: "900",
    fontSize: 35,
    marginBottom: 20,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    width: "90%",
    height: 55,
  },
  btn: {
    width: '50%',
        height: 50,
        borderRadius: 20,
        backgroundColor: "#825640",
        padding: 15,
        alignItems: "center",
        marginTop: 20,
  },
  btnLogin: {
    width: '50%',
    height: 50,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 16,
    color: "green",
    textDecorationLine: 'underline'
},
});
