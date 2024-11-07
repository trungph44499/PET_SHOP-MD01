import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image style={styles.icon} source={require('../../Image/back.png')} />
        </TouchableOpacity>
        <Text style={styles.title}>Danh sách địa chỉ giao hàng</Text>
      </View>

      <FlatList
        data={shippingAddresses}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddShippingAddrees', { emailUser, setShippingAddresses })}
      >
        <Image style={styles.addIcon} source={require('../../Image/add.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default ShippingAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    top: 0,
    backgroundColor: '#fff',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
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
  icon: {
    width: 20,
    height: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
});
