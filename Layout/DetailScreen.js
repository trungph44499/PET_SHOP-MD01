import React from "react";
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
import { numberUtils, upperCaseItem } from "./utils/stringUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";


const DetailProduct = ({ navigation, route }) => {
  const { item } = route.params;

  const buyNow = () => {
    if (item.quantity < 1) {
      ToastAndroid.show("Số lượng sản phẩm không đủ!", ToastAndroid.SHORT);
      return;
    }
  
    navigation.navigate("Payment", {
      total: item.price,
      listItem: [{ 
        id: item._id,
        image: item.img,
        name: item.name,
        type: item.type,
        price: item.price,
        quantity: 1, 
      }],
    });
  };


  const addToCart = async () => {
    try {
      const emailUser = await AsyncStorage.getItem("@UserLogin");

      if (item.quantity < 1) {
        ToastAndroid.show("Số lượng sản phẩm không đủ!", ToastAndroid.SHORT);
        return;
      }

      const response = await axios.post(`${URL}/carts/addToCart`, {
        emailUser,
        _id: item._id,
        img: item.img,
        name: item.name,
        type: item.type,
        price: item.price,
        quantity: item.quantity,
      });

      if (response.status === 200) {
        ToastAndroid.show(response.data.response, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(
          response.data.response || "Có lỗi xảy ra!",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        ToastAndroid.show(
          error.response.data.response || "Có lỗi xảy ra!",
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show("Có lỗi xảy ra!", ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <StatusBar hidden />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.icon} source={require("../Image/back.png")} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
            <Image style={styles.cartIcon} source={require("../Image/cart.png")} />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: item.img }} style={styles.productImage} />
        <View style={styles.detailsContainer}>
          {/* <View style={styles.productId}>
          <Text style={styles.productIdText}>
            {upperCaseFirstItem(item._id.slice(-5))}
          </Text>
        </View> */}
          <View style={styles.priceQuantityContainer}>
            <Text style={styles.priceText}>{numberUtils(item.price)}</Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
            <Text style={styles.detailText}>
              <Text style={styles.availableQuantity}>Mã sp:</Text> {upperCaseItem(item._id.slice(-5))}
            </Text>
            {item.origin && (
              <Text style={styles.detailText}>
                <Text style={styles.availableQuantity}>Xuất xứ:</Text> {item.origin}
              </Text>
            )}
            <Text style={styles.detailText}>
              <Text style={styles.availableQuantity}>Số lượng:</Text> {item.quantity}
            </Text>
            {item.description && (
              <Text style={styles.detailText}>
                <Text style={styles.availableQuantity}>Mô tả:</Text> {item.description}
              </Text>
            )}
          </View>

        </View>
      </ScrollView>
      <View style={styles.rowCart}>

        <TouchableOpacity onPress={addToCart} style={styles.addToCartButton}>
          <Image style={styles.cartButton} source={require("../Image/cart_01.png")} />
        </TouchableOpacity>

        <TouchableOpacity onPress={buyNow} style={styles.addMuaNgayButton}>
          <Text style={styles.addToCartText}>Mua ngay</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default DetailProduct;

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
    padding: 20,
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
  productId: {
    backgroundColor: "#a97053",
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
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EB4F26",
  },
  descriptionContainer: {
    marginTop: 10,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  availableQuantity: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  rowCart: {
    position: 'absolute',
    flexDirection: "row",
    bottom: 0,

  },
  cartButton: {
    width: 30,
    height: 30,
    color: "white"
  },
  addToCartButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#54A798",
    height: 50,
  },
  addMuaNgayButton: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DD5939",
    height: 50,
  },
});