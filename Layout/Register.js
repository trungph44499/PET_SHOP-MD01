import { Image, StyleSheet, Text, TextInput, View, CheckBox, TouchableOpacity, ToastAndroid, KeyboardAvoidingView, Platform, Alert, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { URL } from './HomeScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Register = (props) => {
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [pass2, setpass2] = useState('')
    const [pass, setpass] = useState('')

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    const addUser = async () => {
        if(name == '' || email == '' || pass == ''){
            ToastAndroid.show("Không được để trống",0);
            return;
        }
        if(pass != pass2){
            ToastAndroid.show("Mật khẩu chưa khớp",0);
            return; 
        }
        else if (!validateEmail(email)) {
            ToastAndroid.show('không đúng định dạng email',0)
            return;
        }

        const url = `${URL}/users?email=` + email;
        const url1 = `${URL}/users`;

        fetch(url)
        .then(response => response.json())
        .then(data => {
        if (data.length > 0) {
            throw new Error('Email đã tồn tại')
        }

        return fetch(url1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullname : name,
                email: email,
                pass: pass,
                avatar : 'https://i.pinimg.com/474x/6d/50/9d/6d509d329b23502e4f4579cbad5f3d7f.jpg',
                role: 'user',
            }),
        });
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Đăng ký tài khoản thất bại')
            }
            return response.json();
        })
        .then(async data => {
            ToastAndroid.show('Đăng ký tài khoản thành công', 0)
            await AsyncStorage.setItem('@userRole', 'user') 
            setemail('')
            setpass('')
            props.navigation.navigate("LoginScreen");
        })
        .catch(error => {
            Alert.alert('Đăng ký tài khoản thất bại', error.message)
        })
    }
    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
            <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}> 
                <View style={styles.container}>
                    <Image style={{ width: 210, height: 100, marginBottom: 10, marginTop: 10 }}
                        source={require('../Image/logo_1.png')} />
                    <View style={{ width: '100%', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center', justifyContent: 'center', fontSize: 30 }}>Tạo tài khoản</Text>
                        <TextInput style={styles.input}
                            placeholder='Họ và tên' onChangeText={(txt) => {
                                setname(txt)
                            }} />
                        <TextInput style={styles.input}
                            placeholder='E-mail' onChangeText={(txt) => {
                                setemail(txt)
                            }} />
                        <TextInput style={styles.input}
                            placeholder='Password' onChangeText={(txt) => {
                                setpass(txt)
                            }} />
                        <TextInput style={styles.input}
                            placeholder='Nhập lại Password' onChangeText={(txt) => {
                                setpass2(txt)
                            }} />
                        <Text style={{ textAlign: 'center', marginBottom: 10, marginTop: 10 }}>Để đăng ký tài khoản, bạn đồng ý
                            <Text style={{ textDecorationLine: 'underline', color: 'green' }}>  Terms &{'\n'} Conditions</Text> and
                            <Text style={{ textDecorationLine: 'underline', color: 'green' }}> Privacy Policy</Text>
                        </Text>
                        <TouchableOpacity onPress={addUser}
                        style={styles.btn}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white',  }}>Đăng ký</Text>
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center', color: 'green' }}>________________Hoặc________________</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableOpacity>
                                <Image style={styles.image}
                                    source={require('../Image/google.png')} />
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Image style={[styles.image, { marginLeft: 40 }]}
                                    source={require('../Image/facebook.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.text}>
                            <Text>Tôi đã có tài khoản.</Text>
                            <TouchableOpacity onPress={()=> props.navigation.navigate('LoginScreen')}>
                                <Text style={{ color: 'green', marginLeft: 3 }}>Đăng nhập</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFDF8'
    },
    input: {
        borderRadius: 10,
        borderWidth: 1,
        padding: 15,
        width: '90%',
        height: 55,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn: {
        width: '90%',
        height: 55,
        borderRadius: 20,
        backgroundColor: '#825640',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ffff', // Màu của bóng
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
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    text: {
        flexDirection: 'row',
        justifyContent: 'center',
    }
})