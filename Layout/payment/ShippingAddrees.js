import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShippingAddress = ({ navigation }) => {
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [emailUser, setEmailUser] = useState('');

  // Hàm lấy email người dùng từ AsyncStorage
  const fetchUserEmail = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('@UserLogin');
      if (userEmail) {
        setEmailUser(userEmail);
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      }
    } catch (error) {
      console.error('Lỗi khi lấy email người dùng:', error);
      Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
    }
  };

  // Hàm fetch danh sách địa chỉ giao hàng từ AsyncStorage
  const fetchShippingAddresses = async () => {
    try {
      if (!emailUser) {
        Alert.alert('Lỗi', 'Không tìm thấy email người dùng');
        return;
      }

      // Sử dụng một key duy nhất cho địa chỉ giao hàng, tránh trùng với phương thức thanh toán
      const storedShippingAddresses = await AsyncStorage.getItem(emailUser + '_shippingAddresses'); 
      if (storedShippingAddresses) {
        setShippingAddresses(JSON.parse(storedShippingAddresses));
      }
    } catch (error) {
      console.error('Lỗi khi lấy địa chỉ giao hàng:', error);
    }
  };

  // Hàm xóa địa chỉ giao hàng
  const deleteShippingAddress = async (index) => {
    const updatedShippingAddresses = [...shippingAddresses];
    updatedShippingAddresses.splice(index, 1); // Xóa địa chỉ tại index

    try {
      // Cập nhật lại danh sách địa chỉ giao hàng trong AsyncStorage
      await AsyncStorage.setItem(emailUser + '_shippingAddresses', JSON.stringify(updatedShippingAddresses));
      setShippingAddresses(updatedShippingAddresses); // Cập nhật lại trạng thái trong ứng dụng
      Alert.alert('Thành công', 'Địa chỉ giao hàng đã được xóa');
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ giao hàng:', error);
      Alert.alert('Lỗi', 'Không thể xóa địa chỉ giao hàng');
    }
  };

  // Hàm chỉnh sửa địa chỉ giao hàng
  const editShippingAddress = (address, index) => {
    navigation.navigate('AddShippingAddrees', { 
      emailUser, 
      setShippingAddresses, 
      address, // Chuyển thông tin địa chỉ giao hàng cần chỉnh sửa
      index,   // Chuyển index để biết là chỉnh sửa item nào
    });
  };

  useEffect(() => {
    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (emailUser) {
      fetchShippingAddresses();
    }
  }, [emailUser]);

  const renderItem = ({ item, index }) => (
    <View style={styles.addressContainer}>
      <Text style={styles.addressText}>
        <Text style={styles.bold}>Họ và tên: </Text>{item.fullName}
      </Text>
      <Text style={styles.addressText}>
        <Text style={styles.bold}>Số điện thoại: </Text>{item.phoneNumber}
      </Text>
      <Text style={styles.addressText}>
        <Text style={styles.bold}>Địa chỉ: </Text>{item.address}
      </Text>
      <Text style={styles.addressText}>
        <Text style={styles.bold}>Thành phố: </Text>{item.city}
      </Text>

      <View style={styles.buttonContainer}>
        {/* Nút Sửa */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editShippingAddress(item, index)} // Chỉnh sửa khi nhấn nút
        >
          <Text style={styles.editButtonText}>Sửa</Text>
        </TouchableOpacity>

        {/* Nút Xóa */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteShippingAddress(index)} // Xóa khi nhấn nút
        >
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách địa chỉ giao hàng</Text>

      <FlatList
        data={shippingAddresses}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <Button
        title="Thêm địa chỉ giao hàng"
        onPress={() => navigation.navigate('AddShippingAddrees', { emailUser, setShippingAddresses })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  addressContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  addressText: {
    fontSize: 16,
    marginVertical: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ShippingAddress;
