import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { congItem, truItem, removeItem, removeAllItem } from "../Redux/action";
import axios from "axios";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import { URL } from "./HomeScreen";

const CartScreen = ({ navigation }) => {
  const date = new Date();
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAllVisible, setModalAllVisible] = useState(false);

  useEffect(() => {
    getAllCart();
  }, []);

  const getAllCart = async () => {
    try {
      const { data } = await axios.get(`${URL}/carts/getFromCart`);
      setCartItems(data);
      calculateTotalPrice(data);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return acc + price * quantity;
    }, 0);
    setTotalPrice(total);
  };

  const calculateTotalQuantity = (items) => {
    return items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  };

  const formatPrice = (price) => {
    if (typeof price !== "number") return "0 VNĐ";
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const TaoMaHoaDon = async () => {
    const url = `${URL}/hoadons`;
    const NewHoaDon = { ngayMua: date };

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(NewHoaDon),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      const id = data.id;
      navigation.navigate("Payment", { total: totalPrice, id_bill: id });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../Image/back.png")}
          />
        </TouchableOpacity>
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
          Giỏ hàng
        </Text>
        <TouchableOpacity
          style={{ width: 50 }}
          onPress={() => setModalAllVisible(true)}
        >
          <Image
            style={{ width: 26, height: 26 }}
            source={require("../Image/delete.png")}
          />
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAllVisible}
          onRequestClose={() => setModalAllVisible(false)}
        >
          <View style={styles.cardCotainer}>
            <View style={styles.cardModal}>
              <Text style={styles.textBold}>Xác nhận xóa tất cả đơn hàng?</Text>
              <Text style={{ fontSize: 14, color: "gray" }}>
                Thao tác này sẽ không thể khôi phục.
              </Text>
              <Pressable
                style={styles.btnModal}
                onPress={() => {
                  dispatch(removeAllItem());
                  setModalAllVisible(false);
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
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
      </View>
      <ScrollView>
        {cartItems.map((item) => (
          <View key={item._id} style={styles.item}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <View style={{ padding: 10, justifyContent: "space-between" }}>
              <Text style={{ marginBottom: 1, fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text
                style={{ marginBottom: 1, fontWeight: "bold", color: "#FF0000" }}
              >
                {formatPrice(item.price)} {/* Hiển thị giá sản phẩm */}
              </Text>
              <Text
                style={{ marginBottom: 1, fontWeight: "bold", color: "#000000" }}
              >
                x {item.quantity} {/* Hiển thị số lượng */}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Nút giảm số lượng */}
                <TouchableOpacity onPress={() => dispatch(truItem(item))}>
                  <Text style={{ marginHorizontal: 10, fontSize: 18 }}>-</Text>
                </TouchableOpacity>

                {/* Nút tăng số lượng */}
                <TouchableOpacity onPress={() => dispatch(congItem(item))}>
                  <Text style={{ marginHorizontal: 10, fontSize: 18 }}>+</Text>
                </TouchableOpacity>

                {/* Nút xóa sản phẩm */}
                <TouchableOpacity onPress={() => dispatch(removeItem(item))}>
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      marginLeft: 20,
                    }}
                  >
                    Xóa
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {cartItems.length > 0 ? (
        <View style={styles.totalContainer}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            Tạm tính :{formatPrice(totalPrice)}
          </Text>
          <Text style={{ fontSize: 17 }}>
            Số lượng : {calculateTotalQuantity(cartItems)} {/* Hiển thị tổng số lượng */}
          </Text>
          <TouchableOpacity onPress={TaoMaHoaDon} style={styles.paymentButton}>
            <Text style={{ color: "white" }}>Tiến hành thanh toán</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate("SearchScreen")}
          style={styles.emptyCart}
        >
          <Text style={{ textAlign: "center" }}>
            Giỏ hàng rỗng{"\n"}Thêm sản phẩm vào giỏ hàng
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles remain unchanged
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  totalContainer: {
    flexDirection: "column",
    marginVertical: 20,
  },
  paymentButton: {
    borderRadius: 9,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#825640",
  },
  emptyCart: {
    position: "absolute",
    top: "50%",
    width: "100%",
  },
  cardCotainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardModal: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 10,
    alignItems: "center",
  },
  btnModal: {
    backgroundColor: "#FF5B5B",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  textBold: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default CartScreen;
