import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ToastAndroid, Image, Modal, Pressable } from 'react-native';
import axios from 'axios';
import { URL } from './HomeScreen'; // Đảm bảo URL đã được định nghĩa
import { numberUtils } from './utils/stringUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [emailUser, setEmailUser] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAllVisible, setModalAllVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const userEmail = await AsyncStorage.getItem('@UserLogin');
      setEmailUser(userEmail);
      fetchCart(userEmail);
    };

    fetchUserEmail();
  }, []);

  const fetchCart = async (emailUser) => {
    try {
      const response = await axios.get(`${URL}/carts/getFromCart`, {
        params: { emailUser },
      });
      setCartItems(response.data);
      calculateTotalPrice(response.data);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Không thể tải giỏ hàng!', ToastAndroid.SHORT);
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await axios.delete(`${URL}/carts/removeFromCart/${itemId}`);
      const updatedCart = cartItems.filter(item => item._id !== itemId);
      setCartItems(updatedCart);
      calculateTotalPrice(updatedCart);
      ToastAndroid.show('Sản phẩm đã được xóa khỏi giỏ hàng!', ToastAndroid.SHORT);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Không thể xóa sản phẩm!', ToastAndroid.SHORT);
    }
  };

  const handleRemoveAllFromCart = async () => {
    try {
      await axios.delete(`${URL}/carts/removeAllFromCart/${emailUser}`);
      setCartItems([]);
      setTotalPrice(0);
      ToastAndroid.show('Đã xóa tất cả sản phẩm khỏi giỏ hàng!', ToastAndroid.SHORT);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Không thể xóa tất cả sản phẩm!', ToastAndroid.SHORT);
    }
    setModalAllVisible(false);
  };

  // Hàm tăng số lượng
  const increaseQuantity = async (itemId) => {
    try {
      await axios.patch(`${URL}/carts/increaseQuantity/${itemId}`);
      const updatedCart = cartItems.map(item => {
        if (item._id === itemId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCartItems(updatedCart);
      calculateTotalPrice(updatedCart);
     
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Không thể tăng số lượng!', ToastAndroid.SHORT);
    }
  };

  // Hàm giảm số lượng
  const decreaseQuantity = async (itemId) => {
    try {
      if (cartItems.find(item => item._id === itemId).quantity > 1) {
        await axios.patch(`${URL}/carts/decreaseQuantity/${itemId}`);
        const updatedCart = cartItems.map(item => {
          if (item._id === itemId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        });
        setCartItems(updatedCart);
        calculateTotalPrice(updatedCart);

      } else {
        ToastAndroid.show('Số lượng không thể giảm xuống 0!', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Không thể giảm số lượng!', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{ width: 20, height: 20 }} source={require('../Image/back.png')} />
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Giỏ hàng</Text>
        <TouchableOpacity onPress={() => setModalAllVisible(true)}>
          <Image style={{ width: 26, height: 26 }} source={require('../Image/delete.png')} />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAllVisible}
        onRequestClose={() => setModalAllVisible(false)}>
        <View style={styles.cardCotainer}>
          <View />
          <View style={styles.cardModal}>
            <Text style={styles.textBold}>Xác nhận xóa tất cả đơn hàng?</Text>
            <Text style={{ fontSize: 14, color: 'gray', fontWeight: '400' }}>
              Thao tác này sẽ không thể khôi phục.
            </Text>
            <Pressable
              style={styles.btnModal}
              onPress={handleRemoveAllFromCart}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Đồng ý</Text>
            </Pressable>
            <Text onPress={() => setModalAllVisible(false)}
              style={{ textDecorationLine: 'underline', fontWeight: 'bold', fontSize: 16 }}>Hủy bỏ</Text>
          </View>
        </View>
      </Modal>

      <ScrollView style={{ flex: 1 }}>
        {cartItems.length > 0 ? (
          cartItems.map(item => (
            <View key={item._id} style={styles.item}>
              <Image source={{ uri: item.img }} style={styles.image} />
              <View style={{ padding: 10, justifyContent: 'space-between' }}>
                <Text style={{ marginBottom: 1, fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ marginBottom: 1, fontWeight: 'bold', color: '#FF0000' }}>{numberUtils(item.price)}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => decreaseQuantity(item._id)} style={styles.btn}>
                    <Image source={require('../Image/subtract.png')} style={styles.icon} />
                  </TouchableOpacity>
                  <Text style={{ marginLeft: 10, marginRight: 10 }}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(item._id)} style={styles.btn}>
                    <Image source={require('../Image/add.png')} style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setItemToRemove(item);
                    setModalVisible(true);
                  }}>
                    <Text style={{ textDecorationLine: 'underline', marginLeft: 20 }}>Xóa</Text>
                  </TouchableOpacity>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.cardCotainer}>
                      <View />
                      <View style={styles.cardModal}>
                        <Text style={styles.textBold}>Xác nhận xóa đơn hàng?</Text>
                        <Text style={{ fontSize: 14, color: 'gray', fontWeight: '400' }}>
                          Thao tác này sẽ không thể khôi phục.
                        </Text>
                        <Pressable
                          style={styles.btnModal}
                          onPress={() => {
                            handleRemoveFromCart(itemToRemove._id); // Xóa sản phẩm đã chọn
                            setModalVisible(false);
                          }}>
                          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Đồng ý</Text>
                        </Pressable>
                        <Text onPress={() => setModalVisible(false)}
                          style={{ textDecorationLine: 'underline', fontWeight: 'bold', fontSize: 16 }}>Hủy bỏ</Text>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>
              Giỏ hàng rỗng
              {'\n'}Thêm sản phẩm vào giỏ hàng
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')} style={styles.addButton}>
              <Text style={styles.addButtonText}>Tìm kiếm sản phẩm</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={{ width: '90%', marginVertical: 20, marginHorizontal: '5%', gap: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Tạm tính :</Text>
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{numberUtils(totalPrice)}</Text>
          </View>
          <TouchableOpacity onPress={() => { /* Thực hiện thanh toán */ }} style={styles.checkoutButton}>
            <Text style={{ color: 'white' }}>Tiến hành thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  item: {
    height: 160,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    width: '100%',
    gap: 20,
  },
  image: {
    width: 120,
    height: 120,
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  icon: {
    width: 10,
    height: 10,
  },
  btn: {
    padding: 7,
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 2,
  },
  cardCotainer: {
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardModal: {
    width: '90%',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btnModal: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#825640',
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  textBold: {
    fontSize: 16,
    fontWeight: '400',
  },
  checkoutButton: {
    borderRadius: 9,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#825640',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
  addButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#825640',
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CartScreen;
