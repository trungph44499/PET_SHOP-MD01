import React, { useState } from "react";
import { useSelector } from "react-redux";
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

const OtpScreen = ({ route, navigation }) => { // Lấy navigation từ tham số
  const { email } = route.params;
  const otpFromStore = useSelector((state) => state.otp.otp); // Lấy OTP từ Redux store
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = () => {
    if (otp === "") {
      ToastAndroid.show("Vui lòng nhập mã OTP", ToastAndroid.SHORT);
      return;
    }

    if (otp === otpFromStore) {
      ToastAndroid.show("Mã OTP hợp lệ", ToastAndroid.SHORT);
      navigation.navigate("ResetPassword", { email }); // Chuyển sang màn ResetPassword
    } else {
      ToastAndroid.show("Mã OTP không hợp lệ", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.container}>
          <Text style={styles.title}>Xác thực mã OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mã OTP"
            onChangeText={setOtp}
            value={otp}
          />
          <TouchableOpacity style={styles.btn} onPress={handleVerifyOtp}>
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "white" }}>Xác thực</Text>
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

export default OtpScreen;

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
