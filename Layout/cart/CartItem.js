import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CheckBoxCustom from "../components/CheckBoxCustom";
import { numberUtils } from "../utils/stringUtils";
import React, { useContext, useState } from "react";
import { CartContext } from "./CartContext";

export default function CartItemComponent({ item }) {
  const [checkBox, setCheckBox] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  var [count, setCount] = useState(1);
  const {
    onChangeCheckBox,
    increaseQuantity,
    decreaseQuantity,
    confirmDeleteProduct,
  } = useContext(CartContext);

  return (
    <View style={styles.item}>
      <CheckBoxCustom
        onChangeCheckBox={() => {
          onChangeCheckBox({
            id: item.idProduct,
            name: item.name,
            image: item.img,
            price: item.price,
            quantity: count,
            status: !checkBox,
          });
          setCheckBox(!checkBox);
        }}
        value={checkBox}
      />
      <Image source={{ uri: item.img }} style={styles.image} />
      <View style={{ padding: 10, justifyContent: "space-between" }}>
        <Text style={{ marginBottom: 10, fontWeight: "bold", fontSize: 16 }}>
          {item.name}
        </Text>
        <Text
          style={{
            marginBottom: 10,
            fontWeight: "bold",
            fontSize: 16,
            color: "#ff4c4c",
          }}
        >
          {numberUtils(item.price)}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              if (count > 1) {
                setCount(count - 1);

                decreaseQuantity({
                  id: item.idProduct,
                  name: item.name,
                  price: item.price,
                  image: item.img,
                  quantity: count - 1,
                  status: checkBox,
                });
              }
            }}
            style={styles.btn}
          >
            <Image
              source={require("../../Image/subtract.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, marginRight: 10 }}>{count}</Text>
          <TouchableOpacity
            onPress={() => {
              if (count < item.quantity) {
                setCount(count + 1);

                increaseQuantity({
                  id: item.idProduct,
                  name: item.name,
                  price: item.price,
                  image: item.img,
                  quantity: count + 1,
                  status: checkBox,
                });
              }
            }}
            style={styles.btn}
          >
            <Image
              source={require("../../Image/add.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text
              style={{
                textDecorationLine: "underline",
                marginLeft: 20,
              }}
            >
              Xóa
            </Text>
          </TouchableOpacity>
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
                  style={{
                    fontSize: 14,
                    color: "gray",
                    fontWeight: "400",
                  }}
                >
                  Thao tác này sẽ không thể khôi phục.
                </Text>
                <Pressable
                  style={styles.btnModal}
                  onPress={() => {
                    confirmDeleteProduct(item);
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
    </View>
  );
}
const styles = StyleSheet.create({
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
  textBold: {
    fontSize: 16,
    fontWeight: "400",
  },
  btnModal: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#825640",
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  icon: {
    width: 10,
    height: 10,
  },
  btn: {
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: "#E0E0E0"
  },
});
