import React, { useEffect, useState } from "react";
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
  var [count, setCount] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(item.price);
  const [selectedQuantity, setSelectedQuantity] = useState(item.quantity);

  useEffect(() => {
    if (item.size && item.size.length > 0) {
      const defaultSize = item.size[0];
      setSelectedSize(defaultSize.sizeName);
      setSelectedPrice(defaultSize.price);
      setSelectedQuantity(defaultSize.quantity);
    }
  }, [item.size]);

  const addProdct = () => {
    if (count < selectedQuantity) {
      setCount(count + 1);
    } else {
      ToastAndroid.show("Số lượng sản phẩm không đủ!", ToastAndroid.SHORT);
      return;
    }
  };
  const subtractProdct = () => {
    if (count > 1) {
      setCount(count - 1);
    } else {
      ToastAndroid.show(
        "Số lượng sản phẩm không thể nhỏ hơn 1!",
        ToastAndroid.SHORT
      );
      return;
    }
  };

  const buyNow = () => {
    // console.log("size: ", selectedSize);

    if (!selectedSize) {
      ToastAndroid.show(
        "Vui lòng chọn kích thước trước khi mua!",
        ToastAndroid.SHORT
      );
      return;
    }

    if (selectedQuantity < 1) {
      ToastAndroid.show("Số lượng sản phẩm không đủ!", ToastAndroid.SHORT);
      return;
    }

    navigation.navigate("Payment", {
      total: selectedPrice * parseInt(count),
      listItem: [
        {
          id: item._id,
          image: item.img,
          name: item.name,
          type: item.type,
          price: selectedPrice,
          quantity: parseInt(count),
          size: selectedSize,
        },
      ],
    });
  };

  const addToCart = async () => {
    try {
      const emailUser = await AsyncStorage.getItem("@UserLogin");

      if (!selectedSize) {
        ToastAndroid.show(
          "Vui lòng chọn kích thước trước khi thêm!",
          ToastAndroid.SHORT
        );
        return;
      }

      if (selectedQuantity < 1) {
        ToastAndroid.show("Số lượng sản phẩm không đủ!", ToastAndroid.SHORT);
        return;
      }

      const response = await axios.post(`${URL}/carts/addToCart`, {
        emailUser,
        _id: item._id,
        img: item.img,
        name: item.name,
        type: item.type,
        price: selectedPrice,
        quantity: selectedQuantity,
        size: selectedSize,
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

  const handleSizeSelect = (size) => {
    setSelectedSize(size.sizeName);
    setSelectedPrice(size.price);
    setSelectedQuantity(size.quantity);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <StatusBar hidden />
        <Image source={{ uri: item.img }} style={styles.productImage} />

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={styles.buttonPrice}>
              <Text style={styles.priceText}>{numberUtils(selectedPrice)}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.daBan}>Đã bán: {item.sold}</Text>
            </View>
          </View>


          <View style={styles.itemPrice}>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Image
                style={styles.starIcon}
                source={require("../Image/star.png")}
              />
              <Image
                style={styles.starIcon}
                source={require("../Image/star.png")}
              />
              <Image
                style={styles.starIcon}
                source={require("../Image/star.png")}
              />
              <Image
                style={styles.starIcon}
                source={require("../Image/star.png")}
              />
              <Image
                style={styles.starIcon}
                source={require("../Image/star.png")}
              />
              <Text style={{ marginLeft: 4 }}>(4.9)</Text>
            </View>
            <View style={styles.buttonAddCart}>
              <TouchableOpacity onPress={addProdct} style={styles.btn}>
                <Image
                  source={require("../Image/add.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 10 }}>{count}</Text>
              <TouchableOpacity onPress={subtractProdct} style={styles.btn}>
                <Image
                  source={require("../Image/subtract.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.itemRow}>
            <View style={styles.itemRowRow}>
              <View style={styles.itemBackgroud}>
                <Image
                  source={require("../Image/id_pet.png")}
                  style={{ height: 26, width: 26 }}
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.textItem}>Mã sản phẩm</Text>
                <Text style={styles.textItemItem}>
                  {upperCaseItem(item._id.slice(-5))}
                </Text>
              </View>
            </View>
            <View style={styles.itemRowRow}>
              <View style={styles.itemBackgroud}>
                <Image
                  source={require("../Image/bone.png")}
                  style={{ height: 26, width: 26 }}
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.textItem}>Số lượng</Text>
                <Text style={styles.textItemItem}>{selectedQuantity}</Text>
              </View>
            </View>
          </View>
          <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 5 }}>
            Kích thước
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {item.size && item.size.length > 0 ? (
              item.size.map((size, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.sizeButton,
                    selectedSize === size.sizeName && { backgroundColor: "#C04643" },
                  ]}
                  onPress={() => handleSizeSelect(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size.sizeName && { color: "#FFFFFF" },
                    ]}
                  >
                    {size.sizeName}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ fontSize: 16, color: "gray" }}>Chưa có size</Text>
            )}
          </View>

          <View style={{ marginTop: 5, marginBottom: 40 }}>
            <Text style={styles.textDescription}>Mô tả sản phẩm</Text>
            <Text style={styles.textDescriptionConten}>{item.description}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ position: "absolute", top: "2%", left: "5%" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.iconBack}
            source={require("../Image/left-back.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={{ position: "absolute", top: "2%", right: "5%" }}>
        <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
          <Image
            style={styles.cartIcon}
            source={require("../Image/cart_shopping.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.rowCart}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() =>
            navigation.navigate("ChatScreen", {
              product: item,
            })
          }
        >
          <Image
            style={styles.cartButton}
            source={require("../Image/messenger.png")}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 35, fontWeight: "100", color: "gray" }}>|</Text>
        <TouchableOpacity onPress={addToCart} style={styles.addToCartButton}>
          <Image
            style={styles.cartButton}
            source={require("../Image/cart_detail.png")}
          />
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
    backgroundColor: "#FFFFFF",
  },
  iconBack: {
    width: 26,
    height: 26,
  },
  cartIcon: {
    width: 26,
    height: 26,
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  detailsContainer: {
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
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
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    letterSpacing: 1,
  },
  daBan: {
    fontSize: 14,
    padding: 10,
  },
  textDescription: {
    fontSize: 16,
    color: "black",
    fontWeight: "600",
  },
  textDescriptionConten: {
    fontSize: 15,
    color: "black",
    fontWeight: "450",
  },
  addToCartText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  rowCart: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    backgroundColor: "#FFFFFF",
  },
  cartButton: {
    width: 26,
    height: 26,
  },
  addToCartButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    height: 50,
  },
  addMuaNgayButton: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C04643",
    height: 50,
  },
  itemRow: {
    flexDirection: "row",
    marginVertical: 5,
  },
  itemRowRow: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 6,
  },
  itemBackgroud: {
    padding: 10,
    backgroundColor: "#FBEEC2",
    borderRadius: 10,
  },
  textItem: {
    fontSize: 13,
    color: "gray",
    fontWeight: "600",
  },
  textItemItem: {
    fontSize: 13,
    color: "black",
    fontWeight: "bold",
  },
  itemPrice: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonAddCart: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  btn: {
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  icon: {
    width: 10,
    height: 10,
  },
  sizeButton: {
    padding: 8,
    marginTop: 5,
    marginLeft: 10,
    backgroundColor: "#CDDCEA",
    borderRadius: 8,
  },
  sizeText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "bold",
  },
  buttonPrice: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#CDDCEA",
    borderRadius: 20,
    marginTop: 5,
  },
});
