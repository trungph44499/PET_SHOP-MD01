import React, { useState, useRef } from "react";
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

const OtpScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const otpFromStore = useSelector((state) => state.otp.otp);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleInputChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Chuyển con trỏ sang ô tiếp theo nếu người dùng nhập xong một ký tự
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === "") {
      ToastAndroid.show("Vui lòng nhập mã OTP", ToastAndroid.SHORT);
      return;
    }

    if (enteredOtp === otpFromStore) {
      ToastAndroid.show("Mã OTP hợp lệ", ToastAndroid.SHORT);
      navigation.navigate("ResetPassword", { email });
    } else {
      ToastAndroid.show("Mã OTP không hợp lệ", ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>

        <View style={styles.container}>
      <Text style={styles.title}>Xác thực mã OTP</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange(text, index)}
                value={digit}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.btn} onPress={handleVerifyOtp}>
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "white" }}>Xác thực</Text>
          </TouchableOpacity>
          <Text
            onPress={() => navigation.navigate("LoginScreen")}
            style={styles.btnLogin}
          >
            Trở lại trang đăng nhập
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
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
paddingBottom:90
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#825640",
    textAlign: "center",
    fontSize: 18,


  },
  btn: {
    width: '50%',
    height: 50,
    borderRadius: 20,
    backgroundColor: "#825640",
    padding: 15,
    alignItems: "center",
    marginBottom:40
  },
  btnLogin: {
    width: '50%',
    height: 50,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 16,
    color: "green",
    textDecorationLine: 'underline',
  },
});
