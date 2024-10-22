import React, { useState } from 'react';
import { Image, ScrollView, Text, ToastAndroid, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, congItem } from '../Redux/action';

const DetailProduct = ({ navigation, route }) => {
  const { item } = route.params;
  const [count, setCount] = useState(1);
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const handleTang = () => {
    if (count < item.quantity) {
      setCount(prevCount => prevCount + 1);
    } else {
      ToastAndroid.show('Số lượng không được vượt quá số lượng có sẵn', ToastAndroid.SHORT);
    }
  };

  const handleGiam = () => setCount(prevCount => (prevCount > 1 ? prevCount - 1 : 1));

  const handleAddToCart = () => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    const newQuantity = existingItem ? existingItem.quantity + count : count;

    if (newQuantity <= item.quantity) {
      if (existingItem) {
        dispatch(congItem({ ...existingItem, quantity: newQuantity }));
      } else {
        dispatch(addItem({ ...item, quantity: count }));
      }
      ToastAndroid.show('Đã thêm vào giỏ hàng', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Số lượng trong giỏ hàng không được vượt quá số lượng có sẵn', ToastAndroid.SHORT);
    }
  };

  const handleTextInputChange = (text) => {
    const value = Number(text);
    if (value < 1) {
      setCount(1);
    } else if (value > item.quantity) {
      ToastAndroid.show('Số lượng không được vượt quá số lượng có sẵn', ToastAndroid.SHORT);
      setCount(item.quantity);
    } else {
      setCount(value);
    }
  };

  const formatPrice = (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.icon} source={require('../Image/back.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CartScreen', { count })} style={styles.cartButton}>
          <Image style={styles.cartIcon} source={require('../Image/cart.png')} />
          {cartItems.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{cartItems.length}</Text></View>}
        </TouchableOpacity>
      </View>

      <Image source={{ uri: item.img }} style={styles.productImage} />

      <View style={styles.counterContainer}>
        <TouchableOpacity onPress={handleGiam} style={styles.counterButton}><Text>-</Text></TouchableOpacity>
        <TextInput
          style={styles.counterInput}
          value={count.toString()}
          keyboardType="numeric"
          onChangeText={handleTextInputChange}
        />
        <TouchableOpacity onPress={handleTang} style={styles.counterButton}><Text>+</Text></TouchableOpacity>
      </View>

      <View style={styles.details}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
        <Text>Mô tả: {item.description}</Text>
        <Text>Xuất xứ: {item.origin}</Text>
        <Text>Số lượng còn lại: {item.quantity}</Text>
      </View>

      <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  icon: {
    width: 20,
    height: 20
  },
  cartButton: {
    position: 'relative'
  },
  cartIcon: {
    width: 24,
    height: 24
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 2,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: {
    color: 'white',
    fontSize: 10
  },
  productImage: {
    width: '100%',
    height: 300
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10
  },
  counterButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 10
  },
  counterInput: {
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
  },
  details: {
    padding: 20
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  itemPrice: {
    fontSize: 16,
    color: 'red'
  },
  addToCartButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20
  },
  addToCartText: {
    color: 'white',
    fontSize: 16
  }
});

export default DetailProduct;
