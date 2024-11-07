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
  // modal option
  const OptionModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={modalTiepTuc}>
        <View style={styles.cardCotainer}>
          <View />
          <View style={styles.cardModal}>
            <Text style={styles.textBold}>Xác nhận thanh toán ?</Text>

            <Pressable style={styles.btn} onPress={_payment}>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                Đồng ý
              </Text>
            </Pressable>
            <Text
              onPress={() => setmodalTiepTuc(false)}
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
    );
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
          THANH TOÁN
        </Text>
        <View />
      </View>

      <ScrollView>
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          <UnderLine value={"Nhập thông tin thẻ"} color={"black"} />
          <TextInput
            placeholder="XXXX XXXX XXXX XXXX"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(txt) => setcard(txt)}
          />
          {card == "" ? (
            <Text style={{ color: "red" }}>Vui lòng nhập số thẻ</Text>
          ) : null}
          <TextInput
            placeholder="Tên chủ thẻ"
            style={styles.input}
            onChangeText={(txt) => setcardname(txt)}
          />
          {cardname == "" ? (
            <Text style={{ color: "red" }}>Vui lòng nhập tên chủ thẻ</Text>
          ) : null}
          <TextInput
            placeholder="Ngày hết hạn (MM/YY)"
            style={styles.input}
            onChangeText={(txt) => setcarddate(txt)}
          />
          {carddate == "" ? (
            <Text style={{ color: "red" }}>Vui lòng nhập ngày hết hạn</Text>
          ) : null}
          <TextInput
            placeholder="CVV"
            style={styles.input}
            onChangeText={(txt) => setcvv(txt)}
          />
          {cvv == "" ? (
            <Text style={{ color: "red" }}>Vui lòng nhập CVV</Text>
          ) : null}
        </View>

        <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 30 }}>
          <UnderLine value={"Thông tin khách hàng"} color={"black"} />
          <Text style={styles.textGray}>Họ tên: {user.fullname}</Text>
          <Text style={styles.textGray}>Email: {user.email}</Text>
          <Text style={styles.textGray}>Địa chỉ: {diaChi}</Text>
          <Text style={styles.textGray}>Số điện thoại: {soDienThoai}</Text>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 30 }}>
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

        <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 30 }}>
          <UnderLine value={"Đơn hàng đã chọn"} color={"black"} />
          {listItem &&
            listItem.map((item) => (
              <View key={item.id} style={styles.item}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View
                  style={{
                    padding: 20,
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <Text style={{ color: "gray" }}>
                    Mã sản phẩm: {upperCaseFirstItem(item.id.slice(-5))}
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Tên sản phẩm: {item.name}
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Giá tiền: {numberUtils(item.price)}
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Số lượng : {item.quantity}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
      <View
        style={{
          width: "90%",
          marginVertical: 20,
          marginHorizontal: "5%",
          gap: 20,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ gap: 5 }}>
            <Text style={styles.textBold}>Tạm tính :</Text>
            <Text style={styles.textBold}>Phí vận chuyển :</Text>
            <Text style={styles.textBold}>Tổng tiền :</Text>
          </View>
          <View style={{ gap: 5 }}>
            <Text style={styles.textBold}>{numberUtils(total)}</Text>
            <Text style={styles.textBold}>
              {ship ? "15.000 đ" : "20.000 đ"}
            </Text>
            <Text
              style={[
                styles.textBold,
                { color: "green", fontSize: 17, fontWeight: "bold" },
              ]}
            >
              {numberUtils(total + (ship ? 15000 : 20000))}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            card != "" &&
              cardname != "" &&
              carddate != "" &&
              cvv != "" &&
              setmodalTiepTuc(true);
          }}
          style={{
            borderRadius: 9,
            padding: 12,
            alignItems: "center",
            backgroundColor:
              card && carddate && cardname && cvv ? "#825640" : "gray",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Thanh toán
          </Text>
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
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  textBold: {
    fontSize: 14,
    fontWeight: "400",
  },
  textGray: {
    fontSize: 16,
    color: "gray",
  },
  input: {
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  img: { width: 20, height: 20, position: "absolute", right: 20, top: 20 },
  cardCotainer: {
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardModal: {
    width: "90%",
    marginBottom: 40,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btn: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#825640",
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
  },
  item: {
    height: 160,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    width: "100%",
    gap: 20,
  },
});
