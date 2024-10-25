import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import axios from "axios";
import { URL } from "./HomeScreen";
import { numberUtils, upperCaseFirstItem } from "./utils/stringUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailScreen = ({ navigation, route }) => {
  const { item } = route.params;
  const [quantity, setQuantity] = useState(1); // Trạng thái số lượng

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async () => {
    if (quantity > item.quantity) {
      ToastAndroid.show("Số lượng vượt quá số lượng có sẵn!", ToastAndroid.SHORT);
      return;
    }

    try {
      const emailUser = await AsyncStorage.getItem("@UserLogin");
      const {
        status,
        data: { response },
      } = await axios.post(`${URL}/carts/addToCart`, {
        emailUser,
        ...item,
        quantity,
      });

      if (status === 200) {
        ToastAndroid.show(response, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show("Có lỗi xảy ra!", ToastAndroid.SHORT);
    }
  };

  // Hàm tăng số lượng
  const increaseQuantity = () => {
    if (quantity < item.quantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  // Hàm giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.icon} source={require("../Image/back.png")} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
          <Image
            style={styles.cartIcon}
            source={require("../Image/cart.png")}
          />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: item.img }} style={styles.productImage} />

      <View style={styles.detailsContainer}>
        <View style={styles.productId}>
          <Text style={styles.productIdText}>
            {upperCaseFirstItem(item._id.slice(-5))}
          </Text>
        </View>

        <View style={styles.priceQuantityContainer}>
          <Text style={styles.priceText}>{numberUtils(item.price)}</Text>
          <View style={styles.quantityContainer}>
            <View style={styles.quantityButtonDecrease}>
              <TouchableOpacity
                style={{ height: 28, width: 28 }}
                onPress={decreaseQuantity}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.quantityInput}>{quantity}</Text>

            <View style={styles.quantityButtonIncrease}>
              <TouchableOpacity
                style={{ height: 28, width: 28 }}
                onPress={increaseQuantity}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>

          <Text style={styles.detailText}>
            <Text style={styles.availableQuantity}>Xuất xứ:</Text>
            <Text> {item.origin}</Text>
          </Text>

          <Text style={styles.detailText}>
            <Text style={styles.availableQuantity}>Số lượng:</Text>
            <Text> {item.quantity}</Text>
          </Text>

          <Text style={styles.detailText}>
            <Text style={styles.availableQuantity}>Mô tả:</Text>
            <Text> {item.description}</Text>
          </Text>
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
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#FFF",
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
    width: "60%",
    fontWeight: "bold",
    textAlign: "center",
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    marginTop: 10,
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 10,
  },
  productId: {
    backgroundColor: "#825640",
    borderRadius: 8,
    padding: 8,
    alignSelf: "flex-start",
  },
  productIdText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  priceQuantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    height: 30,
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EB4F26",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#333",
    borderWidth: 1,
  },
  quantityButtonIncrease: {
    borderLeftWidth: 1,
    marginLeft: 10,
    borderLeftColor: "#333",
  },
  quantityButtonDecrease: {
    borderRightWidth: 1,
    borderRightColor: "#333",
    marginRight: 10,
  },
  quantityButtonText: {
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "center",
  },
  quantityInput: {
    fontSize: 17,
    fontWeight: "600",
    width: 20,
    textAlign: "center",
  },
  descriptionContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 8,
    alignItems: "center",
  },
  availableQuantity: {
    color: "green",
    fontWeight: "bold",
  },
  addToCartButton: {
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#825640",
    marginTop: 30,
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
