import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPaymentMethod = ({ route, navigation }) => {
  const { emailUser, setPaymentMethods, paymentMethod, index } = route.params;  // Nhận email, setPaymentMethods, và thông tin chỉnh sửa từ route.params

  // Trạng thái để lưu các thông tin nhập từ người dùng
  const [cardHolderName, setCardHolderName] = useState(paymentMethod?.cardHolderName || '');
  const [cardNumber, setCardNumber] = useState(paymentMethod?.cardNumber || '');
  const [cvv, setCvv] = useState(paymentMethod?.cvv || '');
  const [expirationDate, setExpirationDate] = useState(paymentMethod?.expirationDate || '');

   // Hàm kiểm tra tính hợp lệ của các thông tin nhập
   const validateForm = () => {
    if (!cardHolderName || !cardNumber || !cvv || !expirationDate) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin thẻ!');
      return false;
    }
    // Kiểm tra số thẻ có đúng 16 chữ số không
    if (!/^\d{16}$/.test(cardNumber)) {
      Alert.alert('Lỗi', 'Số thẻ phải có 16 chữ số!');
      return false;
    }
    // Kiểm tra CVV có đúng 3 chữ số không
    if (!/^\d{3}$/.test(cvv)) {
      Alert.alert('Lỗi', 'CVV phải có 3 chữ số!');
      return false;
    }
    // Kiểm tra ngày hết hạn theo định dạng MM/YY và phải là ngày tương lai
    if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
      Alert.alert('Lỗi', 'Ngày hết hạn phải có định dạng MM/YY!');
      return false;
    }

    const [month, year] = expirationDate.split('/');
    const expDate = new Date(`20${year}-${month}-01`);
    const currentDate = new Date();
    if (expDate < currentDate) {
      Alert.alert('Lỗi', 'Ngày hết hạn phải là một ngày trong tương lai!');
      return false;
    }

    return true;
  };

  // Hàm lưu hoặc cập nhật phương thức thanh toán vào AsyncStorage
  const savePaymentMethod = async () => {
    if (!validateForm()) return;

    const newPaymentMethod = {
      cardHolderName,
      cardNumber,
      cvv,
      expirationDate,
    };

    try {
      const storedPaymentMethods = await AsyncStorage.getItem(emailUser + '_paymentMethods');
      let paymentMethods = storedPaymentMethods ? JSON.parse(storedPaymentMethods) : [];

      if (index !== undefined) {
        // Nếu có index, tức là đang sửa phương thức thanh toán, cập nhật phương thức thanh toán tại index
        paymentMethods[index] = newPaymentMethod;
      } else {
        // Nếu không có index, tức là thêm mới phương thức thanh toán
        paymentMethods.push(newPaymentMethod);
      }

      // Lưu lại danh sách phương thức thanh toán đã cập nhật vào AsyncStorage
      await AsyncStorage.setItem(emailUser + '_paymentMethods', JSON.stringify(paymentMethods));

      // Cập nhật lại trạng thái trong màn hình chính
      setPaymentMethods(paymentMethods);

      // Thông báo thành công và quay lại màn hình trước
      Alert.alert('Thành công', 'Phương thức thanh toán đã được lưu');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi lưu phương thức thanh toán:', error);
      Alert.alert('Lỗi', 'Không thể lưu phương thức thanh toán');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{paymentMethod ? 'Chỉnh sửa phương thức thanh toán' : 'Thêm phương thức thanh toán'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên chủ thẻ"
        value={cardHolderName}
        onChangeText={setCardHolderName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số thẻ (16 chữ số)"
        keyboardType="numeric"
        maxLength={16}
        value={cardNumber}
        onChangeText={setCardNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="CVV (3 chữ số)"
        keyboardType="numeric"
        maxLength={3}
        value={cvv}
        onChangeText={setCvv}
      />
      <TextInput
        style={styles.input}
        placeholder="Ngày hết hạn (MM/YY)"
        value={expirationDate}
        onChangeText={setExpirationDate}
      />

      <Button title="Lưu" onPress={savePaymentMethod} />
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default AddPaymentMethod;
