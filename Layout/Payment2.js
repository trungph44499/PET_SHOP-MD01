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
      if (status == 200) {
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
      <View style={styles.cardContainer}>
        <View style={styles.cardModal}>
          <Text style={styles.textBold}>Xác nhận thanh toán ?</Text>

          <Pressable style={styles.btn} onPress={_payment}>
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

      <ScrollView>
        <View style={styles.section}>
          <UnderLine value={"Nhập thông tin thẻ"} color={"black"} />
          <TextInput
            placeholder="XXXX XXXX XXXX XXXX"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(txt) => setcard(txt)}
          />
          {card === "" && (
            <Text style={styles.errorText}>Vui lòng nhập số thẻ</Text>
          )}
          <TextInput
            placeholder="Tên chủ thẻ"
            style={styles.input}
            onChangeText={(txt) => setcardname(txt)}
          />
          {cardname === "" && (
            <Text style={styles.errorText}>Vui lòng nhập tên chủ thẻ</Text>
          )}
          <TextInput
            placeholder="Ngày hết hạn (MM/YY)"
            style={styles.input}
            onChangeText={(txt) => setcarddate(txt)}
          />
          {carddate === "" && (
            <Text style={styles.errorText}>Vui lòng nhập ngày hết hạn</Text>
          )}
          <TextInput
            placeholder="CVV"
            style={styles.input}
            onChangeText={(txt) => setcvv(txt)}
          />
          {cvv === "" && (
            <Text style={styles.errorText}>Vui lòng nhập CVV</Text>
          )}
        </View>

        <View style={styles.section}>
          <UnderLine value={"Thông tin khách hàng"} color={"black"} />
          <Text style={styles.textGray}>Họ tên: {user.fullname}</Text>
          <Text style={styles.textGray}>Email: {user.email}</Text>
          <Text style={styles.textGray}>Địa chỉ: {diaChi}</Text>
          <Text style={styles.textGray}>Số điện thoại: {soDienThoai}</Text>
        </View>

        <View style={styles.section}>
          <UnderLine value={"Phương thức thanh toán"} color={"black"} />
          {ship ? (
            <UnderLine
              value={"Giao hàng nhanh - 15.000đ"}
              color={"gray"}
              color2={"gray"}
              value2={`Dự kiến giao hàng ${day + 3}-${day + 5}/${month + 1}`}
            />
          ) : (
            <UnderLine
              value={"Giao hàng COD - 20.000đ"}
              color={"gray"}
              color2={"gray"}
              value2={`Dự kiến giao hàng ${day + 2}-${day + 4}/${month + 1}`}
            />
          )}
        </View>

        <View style={styles.section}>
          <UnderLine value={"Đơn hàng đã chọn"} color={"black"} />
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
            <Text style={styles.textBold}>
              {ship ? "15.000 đ" : "20.000 đ"}
            </Text>
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
                card && carddate && cardname && cvv ? "#FF6B6B" : "gray",
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
    backgroundColor: "#F7F7F7",
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
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  cardModal: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  btn: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#FF6B6B",
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  cancelText: {
    marginTop: 10,
    color: "gray",
  },
  section: {
    marginVertical: 10,
  },
  item: {
    height: 180,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  itemInfo: {
    marginLeft: 10,
    flex: 1,
  },
  itemCode: {
    fontWeight: "bold",
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
    paddingVertical: 20,
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
});
