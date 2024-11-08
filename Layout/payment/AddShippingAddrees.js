import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddShippingAddrees = ({ route, navigation }) => {
  const { emailUser, setShippingAddresses, address, index } = route.params;

  // Trạng thái để lưu thông tin địa chỉ nhập vào
  const [fullName, setFullName] = useState(address?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(address?.phoneNumber || '');
  const [addressText, setAddressText] = useState(address?.address || '');
  const [city, setCity] = useState(address?.city || '');

  // Hàm kiểm tra tính hợp lệ của các thông tin nhập
  const validateForm = () => {
    // Kiểm tra các trường bắt buộc
    if (!fullName || !phoneNumber || !addressText || !city) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return false;
    }

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^[0-9]{10,11}$/; // Số điện thoại phải có 10 hoặc 11 chữ số
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ! Vui lòng nhập lại.');
      return false;
    }

    // Kiểm tra chiều dài của các trường địa chỉ
    if (addressText.length < 3) {
      Alert.alert('Lỗi', 'Địa chỉ phải có ít nhất 3 ký tự.');
      return false;
    }

    if (city.length < 3) {
      Alert.alert('Lỗi', 'Tên thành phố phải có ít nhất 3 ký tự.');
      return false;
    }

    return true;
  };

  // Hàm lưu hoặc cập nhật địa chỉ giao hàng
  const saveAddress = async () => {
    if (!validateForm()) return;

    const newAddress = { fullName, phoneNumber, address: addressText, city };

    try {
      let storedAddresses = await AsyncStorage.getItem(emailUser + '_shippingAddresses');
      storedAddresses = storedAddresses ? JSON.parse(storedAddresses) : [];

      if (index !== undefined) {
        // Nếu có index, thì cập nhật địa chỉ tại index đó
        storedAddresses[index] = newAddress;
      } else {
        // Nếu không có index, thêm địa chỉ mới vào danh sách
        storedAddresses.push(newAddress);
      }

      await AsyncStorage.setItem(emailUser + '_shippingAddresses', JSON.stringify(storedAddresses));
      setShippingAddresses(storedAddresses); // Cập nhật lại danh sách địa chỉ giao hàng

      Alert.alert('Thành công', 'Địa chỉ đã được lưu!');
      navigation.goBack(); // Quay lại màn hình trước
    } catch (error) {
      console.error('Lỗi khi lưu địa chỉ:', error);
      Alert.alert('Lỗi', 'Không thể lưu địa chỉ');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image style={styles.icon} source={require('../../Image/back.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{address ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={addressText}
        onChangeText={setAddressText}
      />
      <TextInput
        style={styles.input}
        placeholder="Thành phố"
        value={city}
        onChangeText={setCity}
      />
{/* 
      <Button title="Lưu" onPress={saveAddress} /> */}
      <TouchableOpacity style={styles.submitButton} onPress={saveAddress}>
        <Text style={styles.submitText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    top: 0,
    backgroundColor: '#fff',
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
  icon: {
    width: 20,
    height: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddShippingAddrees;
