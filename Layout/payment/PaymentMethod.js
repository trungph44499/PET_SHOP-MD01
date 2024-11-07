import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentMethod = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
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

  // Hàm lấy phương thức thanh toán từ AsyncStorage
  const fetchPaymentMethods = async () => {
    try {
      if (!emailUser) {
        Alert.alert('Lỗi', 'Không tìm thấy email người dùng');
        return;
      }

      // Sử dụng emailUser + '_paymentMethods' làm key riêng cho phương thức thanh toán
      const storedPaymentMethods = await AsyncStorage.getItem(emailUser + '_paymentMethods');
      if (storedPaymentMethods) {
        setPaymentMethods(JSON.parse(storedPaymentMethods));
      }
    } catch (error) {
      console.error('Lỗi khi lấy phương thức thanh toán:', error);
    }
  };

  // Hàm xóa phương thức thanh toán
  const deletePaymentMethod = async (index) => {
    const updatedPaymentMethods = [...paymentMethods];
    updatedPaymentMethods.splice(index, 1); // Xóa phương thức thanh toán tại index

    try {
      // Cập nhật lại danh sách phương thức thanh toán trong AsyncStorage
      await AsyncStorage.setItem(emailUser + '_paymentMethods', JSON.stringify(updatedPaymentMethods));
      setPaymentMethods(updatedPaymentMethods); // Cập nhật lại trạng thái trong ứng dụng
      Alert.alert('Thành công', 'Phương thức thanh toán đã được xóa');
    } catch (error) {
      console.error('Lỗi khi xóa phương thức thanh toán:', error);
      Alert.alert('Lỗi', 'Không thể xóa phương thức thanh toán');
    }
  };

  // Hàm chỉnh sửa phương thức thanh toán
  const editPaymentMethod = (paymentMethod, index) => {
    navigation.navigate('AddPaymentMethod', {
      emailUser,
      setPaymentMethods,
      paymentMethod, // Chuyển thông tin phương thức thanh toán cần chỉnh sửa
      index,         // Chuyển index để biết là chỉnh sửa item nào
    });
  };

  useEffect(() => {
    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (emailUser) {
      fetchPaymentMethods();
    }
  }, [emailUser]);

  const renderItem = ({ item, index }) => (
    <View style={styles.paymentMethodContainer}>
      <Text style={styles.paymentMethodText}>
        <Text style={styles.bold}>Tên chủ thẻ: </Text>{item.cardHolderName}
      </Text>
      <Text style={styles.paymentMethodText}>
        <Text style={styles.bold}>Số thẻ: </Text>{item.cardNumber}
      </Text>
      <Text style={styles.paymentMethodText}>
        <Text style={styles.bold}>Ngày hết hạn: </Text>{item.expirationDate}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editPaymentMethod(item, index)} // Gọi hàm chỉnh sửa khi nhấn nút
        >
          <Text style={styles.editButtonText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deletePaymentMethod(index)} // Gọi hàm xóa khi nhấn nút
        >
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách phương thức thanh toán</Text>

      <FlatList
        data={paymentMethods}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <Button
        title="Thêm phương thức thanh toán"
        onPress={() => navigation.navigate('AddPaymentMethod', { emailUser, setPaymentMethods })}
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
  paymentMethodContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  paymentMethodText: {
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

export default PaymentMethod;
