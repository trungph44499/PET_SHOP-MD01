import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL } from './HomeScreen';
import { launchImageLibrary } from 'react-native-image-picker';

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
    const { img, fullname, email, address, phone } = userInfo;

    if (!fullname || !email || !address || !phone) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const response = await axios.post(`${URL}/users/update`, {
        img,
        fullname,
        email,
        address,
        phone,
      });

      if (response.status === 200 && response.data.type) {
        await AsyncStorage.setItem('@UserLogin', JSON.stringify(response.data.user));
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

  const handleImagePicker = () => {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        Alert.alert(
          'Xác nhận',
          'Bạn có muốn thay đổi ảnh không?',
          [
            {
              text: 'Không',
              style: 'cancel',
            },
            {
              text: 'Có',
              onPress: () => {
                const source = { uri: response.assets[0].uri };
                setUserInfo({ ...userInfo, img: source.uri });
              },
            },
          ],
          { cancelable: false }
        );
      }
    });
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
