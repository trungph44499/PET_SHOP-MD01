import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL } from './HomeScreen';

const PassReset = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    oldPass: '',
    newPass: '',
    confirmNewPass: '',
  });
  const [showPass, setShowPass] = useState({
    oldPass: true,
    newPass: true,
    confirmNewPass: true,
  });

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('@UserLogin');
        if (email) {
          setUserInfo((prev) => ({ ...prev, email }));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserEmail();
  }, []);

  const toggleShowPass = (field) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    const { email, oldPass, newPass, confirmNewPass } = userInfo;

    if (!oldPass || !newPass || !confirmNewPass) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPass !== confirmNewPass) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
      return;
    }

    try {
      // Kiểm tra mật khẩu cũ
      const checkOldPassResponse = await axios.post(`${URL}/users/login`, {
        email,
        pass: oldPass,
      });

      if (checkOldPassResponse.status !== 200 || !checkOldPassResponse.data.type) {
        Alert.alert('Lỗi', 'Mật khẩu cũ không đúng');
        return;
      }

      // Đổi mật khẩu mới
      const response = await axios.post(`${URL}/users/update`, {
        email,
        password: newPass,
      });

      if (response.status === 200 && response.data.type) {
        Alert.alert('Thành công', 'Đổi mật khẩu thành công');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi');
    }
  };


  const { oldPass, newPass, confirmNewPass } = showPass;

  return (
    <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Image style={styles.icon} source={require('../Image/back.png')} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Đổi mật khẩu</Text>
          </View>
          <View style={styles.textInput}>
            <View style={styles.input}>
              <TextInput
                style={styles.textInputField}
                secureTextEntry={oldPass}
                placeholder='Nhập mật khẩu cũ'
                onChangeText={(text) => setUserInfo({ ...userInfo, oldPass: text })}
                value={userInfo.oldPass}
              />
              <TouchableOpacity onPress={() => toggleShowPass('oldPass')}>
                <Image
                  style={styles.icon}
                  source={oldPass ? require('../Image/visible.png') : require('../Image/invisible.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.input}>
              <TextInput
                style={styles.textInputField}
                secureTextEntry={newPass}
                placeholder='Nhập mật khẩu mới'
                onChangeText={(text) => setUserInfo({ ...userInfo, newPass: text })}
                value={userInfo.newPass}
              />
              <TouchableOpacity onPress={() => toggleShowPass('newPass')}>
                <Image
                  style={styles.icon}
                  source={newPass ? require('../Image/visible.png') : require('../Image/invisible.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.input}>
              <TextInput
                style={styles.textInputField}
                secureTextEntry={confirmNewPass}
                placeholder='Nhập lại mật khẩu mới'
                onChangeText={(text) => setUserInfo({ ...userInfo, confirmNewPass: text })}
                value={userInfo.confirmNewPass}
              />
              <TouchableOpacity onPress={() => toggleShowPass('confirmNewPass')}>
                <Image
                  style={styles.icon}
                  source={confirmNewPass ? require('../Image/visible.png') : require('../Image/invisible.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>ĐỔI MẬT KHẨU</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PassReset;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    top: 0,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 1, // Add this line
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    gap: 15,
    top: 30,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textInputField: {
    flex: 1,
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#825640',
    alignItems: 'center',
    marginTop: 70,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
