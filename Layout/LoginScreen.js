import { Image, StyleSheet, Text, TextInput, View, CheckBox, TouchableOpacity, ToastAndroid, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from './HomeScreen';

const LoginScreen = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [showPass, setShowPass] = useState(true);
    const [checkRemember, setCheckRemember] = useState(false);

    const CheckLogin = async () => {
        if (email === '') {
            ToastAndroid.show('Email không được bỏ trống', ToastAndroid.SHORT);
            return;
        }
        if (pass === '') {
            ToastAndroid.show('Pass không được bỏ trống', ToastAndroid.SHORT);
            return;
        }

        let url = `${URL}/users?email=` + email + `&pass=` + pass;


        fetch(url)
            .then(res => res.json())
            .then(async data => {
                if (data.length !== 1) {
                    ToastAndroid.show('Email không chính xác', ToastAndroid.SHORT);
                    return false;
                }
                const user = data[0];
                if (user.pass !== pass) {
                    ToastAndroid.show('Pass không chính xác', ToastAndroid.SHORT);
                    return false;
                } else {
                    await AsyncStorage.setItem('User', JSON.stringify(user, userRole));
                    const userRole = user.role;
                    rememberAccount();
                    ToastAndroid.show('Login thành công', ToastAndroid.SHORT);
                    props.navigation.navigate('Main');
                }
         
            });
    };

 

    const rememberAccount = async () => {
        try {
            if (checkRemember) {
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('pass', pass);
            } else {
                await AsyncStorage.setItem('email', '');
                await AsyncStorage.setItem('pass', '');
            }
        } catch (error) {
            console.error(error);
        }
    };


    const retrieveData = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('email');
            const storedPassword = await AsyncStorage.getItem('pass');
            if (storedEmail !== null && storedPassword !== null) {
                setEmail(storedEmail);
                setPass(storedPassword);
                setCheckRemember(true);
            } else {
                setPass('');
                setCheckRemember(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            retrieveData();
            return () => {
                setEmail('');
                setPass('');
                setShowPass(true);
                setCheckRemember(false);
            };
        }, [])
    );

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center'}}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.container}>
                    <Image style={{ width: 400, height: 200}} source={require('../Image/logo_1.png')} />
                    <View style={{ gap: 10 }}>
                        <Text style={{ fontWeight: '900', textAlign: 'center', justifyContent: 'center', fontSize: 35, marginTop: 30 }}>Chào mừng bạn</Text>
                        <Text style={{ textAlign: 'center', justifyContent: 'center', fontSize: 20, fontStyle: 'normal', fontWeight: '400' }}>Đăng nhập tài khoản</Text>
                        <View style={styles.input}>
                            <TextInput style={{width: '100%'}}
                                placeholder='Nhập email' onChangeText={(txt) => setEmail(txt)} value={email || ''} />
                        </View>
                        <View style={styles.input}>
                            <TextInput style={{ width: '90%' }} secureTextEntry={showPass}
                                placeholder='Nhập mật khẩu' onChangeText={(txt) => setPass(txt)} value={pass || ''} />
                            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                <Image style={{ width: 25, height: 25, marginTop: 1 }}
                                    source={showPass ? require('../Image/visible.png') : require('../Image/invisible.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => setCheckRemember(!checkRemember)}>
                                    <Image style={{ width: 20, height: 20 }}
                                        source={checkRemember ? require('../Image/check.png') : require('../Image/circle.png')} />
                                </TouchableOpacity>
                                <Text style={{ marginLeft: 10 }}>Nhớ tài khoản</Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={{ color: 'green', fontWeight: 'bold' }}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.btn} onPress={() => CheckLogin()}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Đăng nhập</Text>
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center', color: 'green' }}>________________Hoặc________________</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableOpacity>
                                <Image style={styles.image} source={require('../Image/google.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image style={[styles.image, { marginLeft: 40 }]} source={require('../Image/facebook.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.text}>
                            <Text>Bạn không có tài khoản?</Text>
                            <TouchableOpacity onPress={() => { props.navigation.navigate('Register') }}>
                                <Text style={{ color: 'green', marginLeft: 5 }}>Tạo tài khoản</Text>
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
        borderRadius: 20,
        backgroundColor: '#825640',
        padding: 15,
        alignItems: 'center',
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
});
