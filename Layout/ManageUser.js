import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL } from './HomeScreen';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const ManageUser = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    img: '',
    fullname: '',
    email: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const email = await AsyncStorage.getItem('@UserLogin');
        if (email) {
          setUserInfo((prev) => ({ ...prev, email }));
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng.');
      }
    };

    getUserInfo();
  }, []);

  const handleSave = async () => {
    const { img, fullname, email } = userInfo;
  
    if (!fullname || !email) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    let base64Img = '';
    if (img) {
      const fileInfo = await FileSystem.readAsStringAsync(img, { encoding: 'base64' });
      base64Img = `data:image/jpeg;base64,${fileInfo}`;
    }
  
    try {
      const response = await axios.post(`${URL}/users/update`, {
        avatar: base64Img,
        fullname,
        email,
      });
  
      if (response.status === 200 && response.data.type) {
        await AsyncStorage.setItem('@UserLogin', email);
        Alert.alert('Thành công', 'Thông tin người dùng đã được cập nhật.');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật thông tin người dùng.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin người dùng.');
    }
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert('Lỗi', 'Quyền truy cập thư viện ảnh bị từ chối.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      setUserInfo({ ...userInfo, img: pickerResult.uri });
    }
  };

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
          <TouchableOpacity onPress={handleImagePicker}>
            <Image style={{ width: 200, height: 200 }} source={{ uri: userInfo.img || 'https://via.placeholder.com/200' }} />
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', fontSize: 20 }}>Thông tin của bạn</Text>
        </View>
        <View style={styles.textInput}>
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
