import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from './HomeScreen';

const ManageUser = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState({
    img: '',
    fullname: '',
    email: '',
    address: '',
    phone: '',
    pass: "",
  });
  const [showPass, setShowPass] = useState(true);

  const getUserInfo = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('User');
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin người dùng.');
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${URL}/users/${userInfo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        await AsyncStorage.setItem('User', JSON.stringify(updatedUser));
        Alert.alert('Thành công', 'Thông tin người dùng đã được cập nhật.');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật thông tin người dùng.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin người dùng.');
    }
  };

  useEffect(() => {
    getUserInfo();
    setShowPass(true);
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={{ width: 20, height: 20 }} source={require('../Image/back.png')} />
          </TouchableOpacity>
          <Text style={{ marginLeft: 60, fontSize: 18, fontWeight: 'bold' }}>Chỉnh sửa thông tin</Text>
        </View>
        <View style={{ width: '100%', height: 230, justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ width: 200, height: 200 }} source={{ uri: userInfo.img || 'https://via.placeholder.com/200' }} />
          <Text style={{ textAlign: 'center', fontSize: 20 }}>Thông tin của bạn</Text>
        </View>
        <View style={styles.textInput}>
          <TextInput
            style={styles.input}
            placeholder='Image URL'
            value={userInfo.img}
            onChangeText={(text) => setUserInfo({ ...userInfo, img: text })}
          />
          <TextInput
            style={styles.input}
            placeholder='Fullname'
            value={userInfo.fullname}
            onChangeText={(text) => setUserInfo({ ...userInfo, fullname: text })}
          />
          <TextInput
            style={styles.input}
            placeholder='Email'
            value={userInfo.email}
            onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder='Address'
            value={userInfo.address}
            onChangeText={(text) => setUserInfo({ ...userInfo, address: text })}
          />
          <TextInput
            style={styles.input}
            placeholder='Number phone'
            value={userInfo.phone}
            onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
          />
          <View style={styles.input}>
            <TextInput style={{ width: '90%' }} 
              secureTextEntry={showPass}
              placeholder='Nhập mật khẩu' 
              onChangeText={(text) => setUserInfo({ ...userInfo, pass: text })}
              value={userInfo.pass} />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Image style={{ width: 20, height: 20, marginTop: 4 }}
                source={showPass ? require('../Image/visible.png') : require('../Image/invisible.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={{ color: 'white' }}>LƯU THÔNG TIN</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ManageUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
  },
  textInput: {
    padding: 10,
    gap: 15,
  },
  input: {
    // borderWidth: 1,
    // borderRadius: 10,
    // padding: 10,
    // paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'green',
    alignItems: 'center',
  },
});
