import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL } from './HomeScreen';
import * as ImagePicker from 'expo-image-picker';

const ManageUser = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    avatar: '',
    fullname: '',
    email: '',
    address: '',
    sdt: '',
  });
  const [initialUserInfo, setInitialUserInfo] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const email = await AsyncStorage.getItem('@UserLogin');
        if (email) {
          const response = await axios.post(`${URL}/users/getUser`, { email });
          if (response.status === 200) {
            const user = response.data.response[0];
            const userData = {
              avatar: user.avatar || '',
              fullname: user.fullname,
              email: user.email,
              address: user.address || '',
              sdt: user.sdt || '',
            };
            setUserInfo(userData);
            setInitialUserInfo(userData);
          }
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng.');
      }
    };

    getUserInfo();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const newAvatar = result.assets[0].uri;
      setUserInfo({ ...userInfo, avatar: newAvatar });
    }
  };

  const handleSave = async () => {
    const { avatar, fullname, email, address, sdt } = userInfo;

    if (!fullname) {
      Alert.alert('Lỗi', 'Tên không được để trống');
      return;
    }

    if (!sdt) {
      Alert.alert('Lỗi', 'Số điện thoại không được để trống');
      return;
    }

    if (!email) {
      Alert.alert('Lỗi', 'Email không được để trống');
      return;
    }

    if (sdt && (!/^\d+$/.test(sdt) || sdt.length !== 10)) {
      Alert.alert('Lỗi', 'Số điện thoại phải có đúng 10 ký tự');
      return;
    }

    if (sdt[0] !== '0') {
      Alert.alert('Lỗi', 'Số điện thoại phải bắt đầu bằng số 0');
      return;
    }

    if (JSON.stringify(userInfo) === JSON.stringify(initialUserInfo)) {
      Alert.alert('Thông báo', 'Chưa có sự thay đổi nào');
      return;
    }

    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn thay đổi thông tin?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: async () => {
            try {
              const response = await axios.post(`${URL}/users/update`, {
                avatar,
                fullname,
                email,
                address,
                sdt,
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
          },
        },
      ],
      { cancelable: false }
    );
  };


  const clearFullname = () => {
    setUserInfo({ ...userInfo, fullname: '' });
  };

  const clearSdt = () => {
    setUserInfo({ ...userInfo, sdt: '' });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image style={styles.icon} source={require('../Image/back.png')} />
              </TouchableOpacity>
              <Text style={styles.headerText}>Chỉnh sửa thông tin</Text>
            </View>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={pickImage}>
                <Image
                  style={styles.image}
                  source={userInfo.avatar ? { uri: userInfo.avatar } : null}
                />
              </TouchableOpacity>
              <Text style={styles.imageText}>Thông tin của bạn</Text>
            </View>
            <View style={styles.textInput}>
              <View style={styles.input}>
                <TextInput
                  style={styles.textInputField}
                  placeholder='Fullname'
                  value={userInfo.fullname}
                  onChangeText={(text) => setUserInfo({ ...userInfo, fullname: text })}
                />
                {userInfo.fullname ? (
                  <TouchableOpacity onPress={clearFullname} style={styles.bgX}>
                    <Text style={styles.clearButton}>X</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              <View style={styles.input}>
                <TextInput
                  style={styles.textInputField}
                  placeholder='Số điện thoại'
                  value={userInfo.sdt}
                  keyboardType='numeric'
                  onChangeText={(text) => setUserInfo({ ...userInfo, sdt: text })}
                />{userInfo.sdt ? (
                  <TouchableOpacity onPress={clearSdt} style={styles.bgX}>
                    <Text style={styles.clearButton}>X</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>LƯU THÔNG TIN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ManageUser;

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
    zIndex: 1,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  imageText: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
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
  clearButton: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,

  },
  bgX: {
  },
});
