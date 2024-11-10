import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const AddPaymentMethod = ({ route, navigation }) => {
  const { emailUser, setPaymentMethods, paymentMethod, index } = route.params;  // Nhận email, setPaymentMethods, và thông tin chỉnh sửa từ route.params

  // Trạng thái để lưu các thông tin nhập từ người dùng
  const [cardHolderName, setCardHolderName] = useState(paymentMethod?.cardHolderName || '');
  const [cardNumber, setCardNumber] = useState(paymentMethod?.cardNumber || '');
  const [cvv, setCvv] = useState(paymentMethod?.cvv || '');
  const [expirationDate, setExpirationDate] = useState(paymentMethod?.expirationDate || '');


  const handleCardNumberChange = (text) => {
    if (text.length <= 16) {
      setCardNumber(text);
    }
  };
  const handleCardHolderNameChange = (text) => {
    const regex = /^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF]*$/;
    if (!regex.test(text)) {
      Alert.alert('Lỗi', 'Tên chủ thẻ chỉ được chứa chữ cái và khoảng trắng!');
      return;
    }
    setCardHolderName(text);
  };
  const handleCvvChange = (text) => {
    if (text.length <= 3) {
      setCvv(text);
    }
  };

  const handleExpiryDateChange = (text) => {
    if (text.length === 0) {
      setExpirationDate('');
    } else if (text.length === 2 && !text.includes('/')) {
      const month = parseInt(text, 10);
      if (month > 12) {
        Alert.alert('Lỗi', 'Tháng phải nằm trong khoảng từ 01 đến 12!');
        setExpirationDate('');
      } else {
        setExpirationDate(text + '/');
      }
    } else if (text.length === 5) {
      const [month, year] = text.split('/');
      if (parseInt(year, 10) < 24) {
        Alert.alert('Lỗi', 'Ngày hết hạn phải là một ngày trong tương lai!');
      } else {
        setExpirationDate(text);
      }
    } else if (text.length === 3 && text[2] !== '/') {
      setExpirationDate(text.slice(0, 2) + '/' + text[2]);
    } else {
      setExpirationDate(text);
    }
  };

  // Hàm lưu hoặc cập nhật phương thức thanh toán vào AsyncStorage
  const savePaymentMethod = async () => {
    if (!cardHolderName || !cardNumber || !cvv || !expirationDate) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin thẻ!');
      return false;
    }
    // Kiểm tra số thẻ có đúng 16 chữ số không
    if (!/^\d{16}$/.test(cardNumber)) {
      Alert.alert('Lỗi', 'Số thẻ phải có 16 chữ số!');
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

    // Kiểm tra CVV có đúng 3 chữ số không
    if (!/^\d{3}$/.test(cvv)) {
      Alert.alert('Lỗi', 'CVV phải có 3 chữ số!');
      return false;
    }
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
  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image style={styles.icon} source={require('../../Image/back.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{paymentMethod ? 'Chỉnh sửa phương thức thanh toán' : 'Thêm phương thức thanh toán'}</Text>
      </View>

      <View style={styles.content}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          locations={[0, 0.5, 1]} // Điều chỉnh vị trí của các màu để tạo hiệu ứng gợn sóng
          style={styles.cardPreview}>
          <View style={styles.cardHeader}>
            <Image
              source={require('../../Image/card.png')} // Bạn cần thêm hình ảnh chip thẻ
              style={styles.chipImage}
            />
            <Image
              source={require('../../Image/visa.png')} // Bạn cần thêm logo visa
              style={styles.visaLogo}
            />

          </View>
          <View style={{ padding: 10 }}>
            <Text style={styles.cardLabelSo}>SỐ THẺ</Text>
            <Text style={styles.cardNumber}>{formatCardNumber(cardNumber) || '**** **** **** ****'}</Text>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>CHỦ THẺ</Text>
                <Text style={styles.cardValueName}>{cardHolderName || 'NAME'}</Text>
              </View>

              <View>
                <Text style={styles.cardLabel}>HẾT HẠN</Text>
                <Text style={styles.cardValue}>{expirationDate || 'MM/YY'}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>CVV</Text>
                <Text style={styles.cardValueCvv}>{cvv || '***'}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={{marginTop: 20}}>
        <TextInput
          style={styles.input}
          placeholder="Số thẻ"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={handleCardNumberChange}
        />
        <TextInput
          style={styles.input}
          placeholder="Tên chủ thẻ"
          value={cardHolderName}
          onChangeText={handleCardHolderNameChange}
        />
        <View style={styles.inputDayCVV}>
        <TextInput
          style={styles.inputDay}
          placeholder="Ngày hết hạn (MM/YY)"
          keyboardType="numeric"
          value={expirationDate}
          onChangeText={handleExpiryDateChange}
          maxLength={5}
        />
        <TextInput
          style={styles.inputCVV}
          placeholder="CVV"
          keyboardType="numeric"
          value={cvv}
          secureTextEntry
          onChangeText={handleCvvChange}
        />
        </View>
        </View>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={savePaymentMethod}>
        <Text style={styles.submitText}>Lưu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    top: 0,
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
  content: {
    flex: 1,
    marginTop: 0,
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
  cardPreview: {
    height: 200,
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipImage: {
    width: 50,
    height: 40,
    resizeMode: 'contain',
  },
  visaLogo: {
    width: 50,
    height: 40,
    resizeMode: 'contain',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 24,
    letterSpacing: 2,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cardLabel: {
    color: '#ffffff80',
    fontSize: 12,
    marginBottom: 5,
  },
  cardLabelSo: {
    color: '#ffffff80',
    fontSize: 12,
    marginTop: 10,
  },
  cardValue: {
    color: '#fff',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  cardValueName: {
    color: '#fff',
    fontSize: 16,
    textTransform: 'uppercase',
    width: 160,
  },
  cardValueCvv: {
    color: '#fff',
    fontSize: 16,
    textTransform: 'uppercase',
    width: 30,
  },
  input: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputDayCVV:{
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputDay:{
    flex: 1,
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  inputCVV:{
    flex: 1,
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
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
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  }
});

export default AddPaymentMethod;
