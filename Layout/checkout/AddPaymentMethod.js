import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

// Hàm kiểm tra thông tin thẻ
const validateCardInfo = (cardNumber, cardHolderName, cvv, expirationDate) => {
  if (!cardHolderName || !cardNumber || !cvv || !expirationDate) {
    return 'Vui lòng nhập đầy đủ thông tin thẻ!';
  }
  if (!/^\d{16}$/.test(cardNumber)) {
    return 'Số thẻ phải có 16 chữ số!';
  }
  if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
    return 'Ngày hết hạn phải có định dạng MM/YY!';
  }
  const [month, year] = expirationDate.split('/');
  const expDate = new Date(`20${year}-${month}-01`);
  const currentDate = new Date();
  if (expDate < currentDate) {
    return 'Ngày hết hạn phải là một ngày trong tương lai!';
  }
  if (!/^\d{3}$/.test(cvv)) {
    return 'CVV phải có 3 chữ số!';
  }
  return null; // Nếu tất cả hợp lệ
};

const AddPaymentMethod = ({ route, navigation }) => {
  const { emailUser, paymentMethod, index } = route.params;

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

  const savePaymentMethod = async () => {
    const validationError = validateCardInfo(cardNumber, cardHolderName, cvv, expirationDate);
    if (validationError) {
      Alert.alert('Lỗi', validationError);
      return;
    }

    const newPaymentMethod = { cardHolderName, cardNumber, cvv, expirationDate };
    
    try {
      const storedPaymentMethods = await AsyncStorage.getItem(emailUser + '_paymentMethods');
      let paymentMethods = storedPaymentMethods ? JSON.parse(storedPaymentMethods) : [];

      // Nếu có index thì sửa, nếu không thì thêm mới
      if (index !== undefined) {
        paymentMethods[index] = newPaymentMethod;
      } else {
        paymentMethods.push(newPaymentMethod);
      }

      await AsyncStorage.setItem(emailUser + '_paymentMethods', JSON.stringify(paymentMethods));
      Alert.alert('Thành công', 'Phương thức thanh toán đã được lưu');
      navigation.goBack(); // Quay lại màn hình trước
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
          <Image style={styles.icon} source={require('../../Image/left-back.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{paymentMethod ? 'Chỉnh sửa phương thức thanh toán' : 'Thêm phương thức thanh toán'}</Text>
      </View>

      <View style={styles.content}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          locations={[0, 0.5, 1]}
          style={styles.cardPreview}>
          <View style={styles.cardHeader}>
            <Image source={require('../../Image/card.png')} style={styles.chipImage} />
            <Image source={require('../../Image/visa.png')} style={styles.visaLogo} />
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
  input: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    marginTop: 0,
  },
  submitButton: {
    backgroundColor: '#3D5C99',
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
  inputDayCVV: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputDay: {
    flex: 1,
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  inputCVV: {
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
});

export default AddPaymentMethod;
