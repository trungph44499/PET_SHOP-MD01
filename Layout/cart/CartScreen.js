import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Image,
  Modal,
  Pressable,
} from "react-native";
import axios from "axios";
import { URL } from "../HomeScreen"; // Đảm bảo URL đã được định nghĩa
import { numberUtils } from "../utils/stringUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CartItem from "./CartItem";
import { CartContext } from "./CartContext";

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [modalAllVisible, setModalAllVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  var listItemCheck = useRef([]);

  useEffect(() => {
    fetchCart();
  }, []);

  function decreaseQuantity(item) {
    if (item.status) {
      listItemCheck.current = listItemCheck.current.map((e) => {
        if (e.id === item.id) {
          e = item;
        }
        return e;
      });
      calculateTotalPrice(listItemCheck.current);
    }
  }

  function increaseQuantity(item) {
    if (item.status) {
      listItemCheck.current = listItemCheck.current.map((e) => {
        if (e.id == item.id) {
          e = item;
        }
        return e;
      });
      calculateTotalPrice(listItemCheck.current);
    }
  }

  async function confirmDeleteProduct(item) {
    try {
      const emailUser = await AsyncStorage.getItem("@UserLogin");
      const {
        status,
        data: { response, type },
      } = await axios.post(`${URL}/carts/removeFromCart`, {
        id: item.idProduct,
        emailUser: emailUser,
      });
      if (status == 200) {
        ToastAndroid.show(response, ToastAndroid.SHORT);
        if (type) {
          fetchCart();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchCart = async () => {
    try {
      const emailUser = await AsyncStorage.getItem("@UserLogin");
      const response = await axios.get(`${URL}/carts/getFromCart`, {
        params: { emailUser },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error(error);
      ToastAndroid.show("Không thể tải giỏ hàng!", ToastAndroid.SHORT);
    }
  };

  function onChangeCheckBox(item) {
    if (item.status) {
      listItemCheck.current.push(item);
    } else {
      listItemCheck.current = listItemCheck.current.filter(
        (e) => e.id != item.id
      );
    }

    calculateTotalPrice(listItemCheck.current);
    setTotalProduct(listItemCheck.current.length);
  }

  const calculateTotalPrice = (items) => {
    var total = 0;
    items.forEach((element) => {
      total += element.price * element.quantity;
    });

    setTotalPrice(total);
  };

  async function deleteAllProductSelected() {
    try {
      const emailUser = await AsyncStorage.getItem("@UserLogin");
      const {
        status,
        data: { response, type },
      } = await axios.post(`${URL}/carts/removeAllFromCart`, {
        list: listItemCheck.current,
        emailUser: emailUser,
      });
      if (status == 200) {
        ToastAndroid.show(response, ToastAndroid.SHORT);
        if (type) {
          fetchCart();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <CartContext.Provider
      value={{
        onChangeCheckBox,
        increaseQuantity,
        decreaseQuantity,
        confirmDeleteProduct,
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../../Image/back.png")}
            />
          </TouchableOpacity>
          <Text
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            Giỏ hàng
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (listItemCheck.current.length == 0) {
                ToastAndroid.show(
                  "Bạn chưa chọn sản phẩm nào!",
                  ToastAndroid.SHORT
                );
                return;
              }
              setModalAllVisible(true);
            }}
          >
            <Image
              style={{ width: 26, height: 26 }}
              source={require("../../Image/delete.png")}
            />
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAllVisible}
          onRequestClose={() => setModalAllVisible(false)}
        >
          <View style={styles.cardCotainer}>
            <View style={styles.cardModal}>
              <Text style={styles.textBold}>Xác nhận xóa tất cả đơn hàng?</Text>
              <Text style={{ fontSize: 14, color: "gray", fontWeight: "400" }}>
                Thao tác này sẽ không thể khôi phục.
              </Text>
              <Pressable
                style={styles.btnModal}
                onPress={() => {
                  deleteAllProductSelected();
                  setModalAllVisible(false);
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  Đồng ý
                </Text>
              </Pressable>
              <Text
                onPress={() => setModalAllVisible(false)}
                style={{
                  textDecorationLine: "underline",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Hủy bỏ
              </Text>
            </View>
          </View>
        </Modal>

        <ScrollView>
          {cartItems.length > 0 ? (
            cartItems.map((item) => <CartItem key={item._id} item={item} />)
          ) : (
            <View style={styles.emptyCartContainer}>
              <Text style={styles.emptyCartText}>
                Giỏ hàng rỗng
                {"\n"}Thêm sản phẩm vào giỏ hàng
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Xem sản phẩm mới</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {cartItems.length > 0 && (
          <View
            style={{
              width: "90%",
              marginVertical: 10,
              marginHorizontal: "5%",
              gap: 15,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>Tạm tính :</Text>

              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                {numberUtils(totalPrice)}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>Số lượng :</Text>

              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                {totalProduct} sản phẩm
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                if(listItemCheck.current.length > 0){
                  navigation.navigate("Payment", {
                    total: totalPrice,
                    listItem: listItemCheck.current,
                  });
                }
               else{
                ToastAndroid.show("Chưa chọn sản phẩm nào!", ToastAndroid.SHORT);
               }
              }}
              style={styles.checkoutButton}
            >
              <Text style={{ color: "white" }}>Tiến hành thanh toán</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </CartContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  item: {
    height: 160,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    width: "100%",
    gap: 10,
  },
  image: {
    width: 120,
    height: 120,
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  cardCotainer: {
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cardModal: {
    width: "90%",
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btnModal: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#825640",
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  textBold: {
    fontSize: 16,
    fontWeight: "400",
  },
  checkoutButton: {
    borderRadius: 9,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#825640",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyCartText: {
    textAlign: "center",
    fontSize: 16,
    color: "black",
  },
  addButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#825640",
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CartScreen;
