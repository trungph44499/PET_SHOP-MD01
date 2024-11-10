import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import UnderLine from "../components/UnderLine";
import { URL } from "./HomeScreen";
import { numberUtils, upperCaseFirstItem } from "./utils/stringUtils";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Payment2 = ({ route }) => {
  const { listItem, total, user, soDienThoai, diaChi, ship } = route.params;
  const navigation = useNavigation();
  const day = new Date().getDay();
  const month = new Date().getMonth();
  const [card, setcard] = useState("");
  const [cardname, setcardname] = useState("");
  const [carddate, setcarddate] = useState("");
  const [cvv, setcvv] = useState("");
  const [modalTiepTuc, setmodalTiepTuc] = useState(false);

  async function _payment() {
    try {
      const {
        status,
        data: { response, type },
      } = await axios.post(`${URL}/pay/add`, {
        email: user.email,
        location: diaChi,
        number: soDienThoai,
        products: listItem,
      });
      if (status === 200) {
        ToastAndroid.show(response, ToastAndroid.SHORT);
        if (type) {
          setmodalTiepTuc(false);
          const {
            status: _status,
            data: { type: _type },
          } = await axios.post(`${URL}/carts/removeAllFromCart`, {
            list: listItem,
            emailUser: user.email,
          });
          if (_type) navigation.popToTop();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const OptionModal = () => (
    <Modal animationType="slide" transparent={true} visible={modalTiepTuc}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Xác nhận thanh toán ?</Text>
          <Pressable style={styles.btnConfirm} onPress={_payment}>
            <Text style={styles.btnText}>Đồng ý</Text>
          </Pressable>
          <Text
            onPress={() => setmodalTiepTuc(false)}
            style={styles.cancelText}
          >
            Hủy bỏ
          </Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../Image/back.png")}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>THANH TOÁN</Text>
        <View />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <UnderLine value={"Nhập thông tin thẻ"} color={"#000000"} />
          <TextInput
            placeholder="XXXX XXXX XXXX XXXX"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(txt) => setcard(txt)}
          />
          {card === "" && <Text style={styles.errorText}>Vui lòng nhập số thẻ</Text>}
          <TextInput
            placeholder="Tên chủ thẻ"
            style={styles.input}
            onChangeText={(txt) => setcardname(txt)}
          />
          {cardname === "" && <Text style={styles.errorText}>Vui lòng nhập tên chủ thẻ</Text>}
          <TextInput
            placeholder="Ngày hết hạn (MM/YY)"
            style={styles.input}
            onChangeText={(txt) => setcarddate(txt)}
          />
          {carddate === "" && <Text style={styles.errorText}>Vui lòng nhập ngày hết hạn</Text>}
          <TextInput
            placeholder="CVV"
            style={styles.input}
            onChangeText={(txt) => setcvv(txt)}
          />
          {cvv === "" && <Text style={styles.errorText}>Vui lòng nhập CVV</Text>}
        </View>

        <View style={styles.section}>
          <UnderLine value={"Thông tin khách hàng"} color={"#000000"} />
          <Text style={styles.textGray}>Họ tên: {user.fullname}</Text>
          <Text style={styles.textGray}>Email: {user.email}</Text>
          <Text style={styles.textGray}>Địa chỉ: {diaChi}</Text>
          <Text style={styles.textGray}>Số điện thoại: {soDienThoai}</Text>
        </View>

        <View style={styles.section}>
          <UnderLine value={"Phương thức thanh toán"} color={"#000000"} />
          {ship ? (
            <UnderLine
              value={"Giao hàng nhanh - 15.000đ"}
              color={"#000000"}
              value2={`Dự kiến giao hàng ${day + 3}-${day + 5}/${month + 1}`}
            />
          ) : (
            <UnderLine
              value={"Giao hàng COD - 20.000đ"}
              color={"#000000"}
              value2={`Dự kiến giao hàng ${day + 2}-${day + 4}/${month + 1}`}
            />
          )}
        </View>

        <View style={styles.section}>
          <UnderLine value={"Đơn hàng đã chọn"} color={"#000000"} />
          {listItem &&
            listItem.map((item) => (
              <View key={item.id} style={styles.item}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemCode}>
                    Mã sản phẩm: {upperCaseFirstItem(item.id.slice(-5))}
                  </Text>
                  <Text style={styles.itemName}>Tên sản phẩm: {item.name}</Text>
                  <Text style={styles.itemPrice}>
                    Giá tiền: {numberUtils(item.price)}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    Số lượng: {item.quantity}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>

      <View style={styles.paymentSection}>
        <View style={styles.paymentInfo}>
          <View style={styles.textColumn}>
            <Text style={styles.textBold}>Tạm tính :</Text>
            <Text style={styles.textBold}>Phí vận chuyển :</Text>
            <Text style={styles.textBold}>Tổng tiền :</Text>
          </View>
          <View style={styles.amountColumn}>
            <Text style={styles.textBold}>{numberUtils(total)}</Text>
            <Text style={styles.textBold}>{ship ? "15.000 đ" : "20.000 đ"}</Text>
            <Text style={styles.totalAmount}>
              {numberUtils(total + (ship ? 15000 : 20000))}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            card && cardname && carddate && cvv && setmodalTiepTuc(true);
          }}
          style={[
            styles.payButton,
            {
              backgroundColor:
                card && cardname && carddate && cvv ? "#FF6B6B" : "#E0E0E0",
            },
          ]}
        >
          <Text style={styles.payButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>

      <OptionModal />
    </View>
  );
};

export default Payment2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  headerText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  textBold: {
    fontSize: 15,
    fontWeight: "500",
  },
  textGray: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderBottomWidth: 2,
    borderBottomColor: "#D3D3D3", // Chỉnh sửa màu gạch ngang thành đen
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginLeft:10
  },
  scrollContainer: {
    marginBottom: 30,
  },
  section: {
    marginVertical: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  itemInfo: {
    marginLeft: 15,
    flex: 1,
  },
  itemCode: {
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  itemName: {
    color: "#555",
  },
  itemPrice: {
    color: "#FF6B6B",
  },
  itemQuantity: {
    color: "#555",
  },
  paymentSection: {
    paddingVertical: 1,
  },
  paymentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textColumn: {
    flex: 1,
  },
  amountColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  payButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  payButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
    position:'absolute',
    bottom: 20,
    
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  btnConfirm: {
    padding: 14,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  cancelText: {
    marginTop: 10,
    color: "gray",
  },
});
