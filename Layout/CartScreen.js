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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { congItem, removeItem, truItem, removeAllItem } from "../Redux/action";
import { URL } from "./HomeScreen";
import axios from "axios";

const CartScreen = ({ navigation }) => {
  // const [date, setdate] = useState(new Date());
  const date = new Date();
  //   const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // Modal cho xóa từng sản phẩm
  const [modalAllVisible, setModalAllVisible] = useState(false); // Modal cho xóa tất cả sản phẩm
  const [itemToRemove, setItemToRemove] = useState(null);

  async function getAllCart() {
    try {
      const { status, data } = await axios.get(`${URL}/carts/getFromCart`);
      if (status == 200) {
        setCartItems(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // calculateTotalPrice();
    getAllCart();
  }, []);

  const calculateTotalPrice = () => {
    let total = 0;
    cartItems.forEach((item) => {
      const price = parseInt(item.price.replace(/\./g, ""), 10);
      const quantity = parseInt(item.quantity, 10);
      // Kiểm tra giá và số lượng hợp lệ
      if (!isNaN(price) && price >= 0 && !isNaN(quantity) && quantity >= 0) {
        total += price * quantity; // Có thể bỏ nhân với 1.000.000 nếu không cần thiết
      } else {
        console.warn(`Invalid price or quantity for item: ${item.name}`);
      }
    });
    setTotalPrice(total);
  };

  const formatPrice = (price) => {
    // Sử dụng phương thức toLocaleString để định dạng giá theo định dạng tiền tệ của Việt Nam (VND)
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const TaoMaHoaDon = async () => {
    const url = `${URL}/hoadons`;
    const NewHoaDon = {
      ngayMua: date,
    };

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
      console.log("id_bill : " + id);
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
          onPress={() => {
            setModalAllVisible(true); // Hiển thị modal cho xóa tất cả sản phẩm
          }}
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
            <View />
            <View style={styles.cardModal}>
              <Text style={styles.textBold}>Xác nhận xóa tất cả đơn hàng?</Text>
              <Text style={{ fontSize: 14, color: "gray", fontWeight: "400" }}>
                Thao tác này sẽ không thể khồi phục.
              </Text>
              <Pressable
                style={styles.btnModal}
                onPress={() => {
                  dispatch(removeAllItem());
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
      </View>
      <ScrollView>
        {cartItems.map((item) => (
          <View key={item._id} style={styles.item}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <View
              style={{ padding: 10, justifyContent: "space-between", gap: 10 }}
            >
              <Text style={{ marginBottom: 1, fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text
                style={{
                  marginBottom: 1,
                  fontWeight: "bold",
                  color: "#FF0000",
                }}
              >
                {item.price}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(truItem(item));
                  }}
                  style={styles.btn}
                >
                  <Image
                    source={require("../Image/subtract.png")}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <Text style={{ marginLeft: 10, marginRight: 10 }}>
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(congItem(item));
                  }}
                  style={styles.btn}
                >
                  <Image
                    source={require("../Image/add.png")}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setItemToRemove(item); // Lưu sản phẩm cần xóa
                    setModalVisible(true); // Hiển thị modal cho xóa từng sản phẩm
                  }}
                >
                  <Text
                    style={{ textDecorationLine: "underline", marginLeft: 20 }}
                  >
                    Xóa
                  </Text>
                </TouchableOpacity>
              </View>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.cardCotainer}>
                  <View />
                  <View style={styles.cardModal}>
                    <Text style={styles.textBold}>Xác nhận xóa đơn hàng?</Text>
                    <Text
                      style={{ fontSize: 14, color: "gray", fontWeight: "400" }}
                    >
                      Thao tác này sẽ không thể khồi phục.
                    </Text>
                    <Pressable
                      style={styles.btnModal}
                      onPress={() => {
                        dispatch(removeItem(itemToRemove));
                        setModalVisible(false);
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        Đồng ý
                      </Text>
                    </Pressable>
                    <Text
                      onPress={() => setModalVisible(false)}
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
          </View>
        ))}
      </ScrollView>

      {cartItems.length > 0 ? (
        <View
          style={{
            width: "90%",
            marginVertical: 20,
            marginHorizontal: "5%",
            gap: 20,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Tạm tính :</Text>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              {formatPrice(totalPrice)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              TaoMaHoaDon();
            }}
            style={{
              borderRadius: 9,
              padding: 12,
              alignItems: "center",
              backgroundColor: "#825640",
            }}
          >
            <Text style={{ color: "white" }}>Tiến hành thanh toán</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SearchScreen");
          }}
          style={{ position: "absolute", top: "50%", width: "100%" }}
        >
          <Text style={{ textAlign: "center" }}>
            Giỏ hàng rỗng
            {"\n"}Thêm sản phẩm vào giỏ hàng
          </Text>
        </TouchableOpacity>
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
    height: "100%",
    justifyContent: "space-between",
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
});

export default CartScreen;
