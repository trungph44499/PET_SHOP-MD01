import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const PaymentMethod = ({ navigation }) => {
  const [emailUser, setEmailUser] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [checkRemember, setCheckRemember] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Trạng thái refreshing

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

  const fetchPaymentMethods = async () => {
    try {
      if (!emailUser) {
        Alert.alert('Lỗi', 'Không tìm thấy email người dùng');
        return;
      }

      const storedPaymentMethods = await AsyncStorage.getItem(emailUser + '_paymentMethods');
      if (storedPaymentMethods) {
        setPaymentMethods(JSON.parse(storedPaymentMethods));
      }
    } catch (error) {
      console.error('Lỗi khi lấy phương thức thanh toán:', error);
    }
  };

  // Hàm handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true); // Bắt đầu refreshing
    await fetchPaymentMethods(); // Tải lại danh sách phương thức thanh toán
    setRefreshing(false); // Kết thúc refreshing
  };

  const deletePaymentMethod = async (index) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa thẻ này không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              const storedPaymentMethods = await AsyncStorage.getItem(emailUser + '_paymentMethods');
              if (storedPaymentMethods) {
                const updatedPaymentMethods = JSON.parse(storedPaymentMethods);
                updatedPaymentMethods.splice(index, 1);

                await AsyncStorage.setItem(emailUser + '_paymentMethods', JSON.stringify(updatedPaymentMethods));
                Alert.alert('Thành công', 'Phương thức thanh toán đã được xóa');
                fetchPaymentMethods(); // Cập nhật lại danh sách sau khi xóa
              }
            } catch (error) {
              console.error('Lỗi khi xóa phương thức thanh toán:', error);
              Alert.alert('Lỗi', 'Không thể xóa phương thức thanh toán');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const editPaymentMethod = (paymentMethod, index) => {
    navigation.navigate('AddPaymentMethod', {
      emailUser,
      paymentMethod,
      index,
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

  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return '**** **** **** ****';
    const lastFourDigits = cardNumber.slice(-4);
    return `**** **** **** ${lastFourDigits}`;
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => editPaymentMethod(item, index)} style={styles.paymentMethodContainer}>
      <View>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          locations={[0, 0.5, 1]} // Điều chỉnh vị trí của các màu để tạo hiệu ứng gợn sóng
          style={styles.cardPreview}>
          <TouchableOpacity
            style={styles.deleteIconContainer}
            onPress={() => deletePaymentMethod(index)} // Gọi hàm xóa khi nhấn nút
          >
            <Image style={styles.deleteIcon} source={require('../../Image/cancel.png')} />
          </TouchableOpacity>
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
            <Text style={styles.cardNumber}>{formatCardNumber(item.cardNumber)}</Text>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>CHỦ THẺ</Text>
                <Text style={styles.cardValueName}>{item.cardHolderName}</Text>
              </View>

              <View>
                <Text style={styles.cardLabel}>HẾT HẠN</Text>
                <Text style={styles.cardValue}>{item.expirationDate}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.checkbox}>
          <TouchableOpacity
            onPress={() => setCheckRemember(!checkRemember)}
          >
            <Image
              style={{ width: 20, height: 20 }}
              source={checkRemember
                ? require("../../Image/check-box.png")
                : require("../../Image/square.png")
              }
            />
          </TouchableOpacity>
          <Text style={{ marginLeft: 10 }}>Sử dụng làm phương thức thanh toán mặc định</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (paymentMethods.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image style={styles.icon} source={require('../../Image/back.png')} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Phương thức thanh toán</Text>
        </View>

        {/* Thông báo nếu không có phương thức thanh toán */}
        <Text style={styles.emptyStateText}>Chưa có phương thức thanh toán</Text>

        {/* Pull-to-refresh khi không có phương thức thanh toán */}
        <FlatList
          data={[]}
          renderItem={() => null}
          keyExtractor={() => 'empty'}
          onRefresh={handleRefresh} // Thêm sự kiện pull-to-refresh
          refreshing={refreshing} // Cập nhật trạng thái refreshing
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPaymentMethod', { emailUser })}
        >
          <Image style={styles.addIcon} source={require('../../Image/add.png')} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image style={styles.icon} source={require('../../Image/back.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Phương thức thanh toán</Text>

      </View> 

      <FlatList
        data={paymentMethods}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        // contentContainerStyle={styles.listContentContainer}
        onRefresh={handleRefresh} 
        refreshing={refreshing} 
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPaymentMethod', { emailUser })} // Chỉ truyền emailUser
      >
        <Image style={styles.addIcon} source={require('../../Image/add.png')} />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyStateText:{
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  paymentMethodContainer: {
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 25,
    height: 25,
    tintColor: 'black',
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
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  deleteIcon: {
    width: 25,
    height: 25,
    tintColor: 'black',
  },
  deleteIconContainer: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    position: 'absolute',
    margin: 10,
    top: 0,
    right: 0,
    borderRadius: 50,
  },
  checkbox: {
    flexDirection: "row",
    marginBottom: 20,
  }
});

export default PaymentMethod;
