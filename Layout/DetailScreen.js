import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View, TextInput } from 'react-native';
import axios from 'axios';
import { URL } from './HomeScreen';
import { numberUtils, upperCaseFirstItem } from './utils/stringUtils';

const DetailScreen = ({ navigation, route }) => {
  const { item } = route.params;
  const [quantity, setQuantity] = useState(1); // Trạng thái số lượng

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async () => {
    try {
      const { status, data: { response } } = await axios.post(`${URL}/carts/addToCart`, { ...item, quantity });

      if (status === 200) {
        ToastAndroid.show(response, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm tăng số lượng
  const increaseQuantity = () => {
    if (quantity < item.quantity) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  // Hàm giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  // Xử lý thay đổi số lượng thủ công
  const handleQuantityChange = (text) => {
    const num = parseInt(text, 10);
    if (!isNaN(num) && num > 0 && num <= item.quantity) {
      setQuantity(num);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.icon} source={require('../Image/back.png')} />
        </TouchableOpacity>
        <Text style={styles.title}>{item.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
          <Image style={styles.cartIcon} source={require('../Image/cart.png')} />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: item.img }} style={styles.productImage} />

      <View style={styles.detailsContainer}>
        <View style={styles.productId}>
          <Text style={styles.productIdText}>{upperCaseFirstItem(item._id.slice(-5))}</Text>
        </View>

        <View style={styles.priceQuantityContainer}>
          <Text style={styles.priceText}>{numberUtils(item.price)}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              value={String(quantity)}
              onChangeText={handleQuantityChange}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
          {item.origin && (
            <Text style={styles.detailText}>Xuất xứ: {item.origin}</Text>
          )}
          <Text style={styles.detailText}>
            Số lượng: <Text style={styles.availableQuantity}>còn {item.quantity} sp</Text>
          </Text>
          <Text style={styles.descriptionText}>Mô tả: {item.description}</Text>
        </ScrollView>
      </View>

      <TouchableOpacity onPress={addToCart} style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    elevation: 3,
  },
  icon: {
    width: 24,
    height: 24,
  },
  cartIcon: {
    width: 26,
    height: 26,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    marginTop: 10,
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 10,
  },
  productId: {
    backgroundColor: '#825640',
    borderRadius: 8,
    padding: 8,
    alignSelf: 'flex-start',
  },
  productIdText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EB4F26',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: '#825640',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#825640',
    borderRadius: 5,
    padding: 8,
    width: 50,
    textAlign: 'center',
    marginHorizontal: 5,
    fontSize: 18,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 8,
  },
  availableQuantity: {
    color: 'green',
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 10,
  },
  addToCartButton: {
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#825640',
    marginTop: 30,
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
