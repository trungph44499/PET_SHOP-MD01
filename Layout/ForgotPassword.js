import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ToastAndroid,
  StyleSheet,
} from "react-native";
import { auth } from '../Layout/utils/firebaseConfig'; // Import firebase auth
import { sendPasswordResetEmail } from "firebase/auth";
import axios from 'axios';


const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    if (!email) {
      ToastAndroid.show("Vui lòng nhập email", ToastAndroid.SHORT);
      return;
    }
  
    try {
      // Kiểm tra xem email có tồn tại trong MongoDB không
      const response = await axios.post(`${URL}/users/check-email`, { email });
  
      if (response.data.exists) {
        // Nếu email tồn tại, gửi email đặt lại mật khẩu
        await sendPasswordResetEmail(auth, email);
        ToastAndroid.show("Đã gửi email để đặt lại mật khẩu", ToastAndroid.SHORT);
        props.navigation.navigate("LoginScreen"); // Quay lại màn hình đăng nhập
      } else {
        // Nếu email không tồn tại
        ToastAndroid.show("Tài khoản không tồn tại", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show("Có lỗi xảy ra. Vui lòng thử lại.", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
        <Text style={styles.buttonText}>Gửi yêu cầu đặt lại mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFDF8",
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    width: "90%",
    height: 55,
  },
  button: {
    marginTop: 20,
    width: "90%",
    height: 55,
    borderRadius: 20,
    backgroundColor: "#825640",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ForgotPassword;
