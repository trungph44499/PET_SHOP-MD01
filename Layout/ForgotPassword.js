import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setOtp } from "../Redux/store"; // Đường dẫn đến file store.js
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

const ForgotPassword = (props) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    const handleForgotPassword = async () => {
        if (email === "") {
            ToastAndroid.show("Email không được bỏ trống", ToastAndroid.SHORT);
            return;
        }

        try {
            // Tạo mã OTP ngẫu nhiên
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            dispatch(setOtp(otp)); // Lưu OTP vào Redux store

            const response = await axios.post(`${URL}/users/forgot-password`, { email, otp });
            ToastAndroid.show(response.data.response, ToastAndroid.SHORT);
            props.navigation.navigate("OtpScreen", { email }); // Chuyển sang màn OtpScreen
        } catch (error) {
            console.log(error);
            ToastAndroid.show("Đã xảy ra lỗi, vui lòng thử lại", ToastAndroid.SHORT);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.container}>
                    <Text style={styles.title}>Quên mật khẩu</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập email"
                        onChangeText={setEmail}
                        value={email}
                    />
                    <TouchableOpacity style={styles.btn} onPress={handleForgotPassword}>
                        <Text style={{ fontWeight: "bold", fontSize: 16, color: "white" }}>Gửi mã OTP</Text>
                    </TouchableOpacity>
                    <Text
                        onPress={() => props.navigation.navigate("LoginScreen")}
                        style={styles.btnLogin}>Trở lại trang đăng nhập
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ForgotPassword;

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
