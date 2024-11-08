import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import UnderLine from "../components/UnderLine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL } from "./HomeScreen";
import axios from "axios";

const Payment = ({ navigation, route }) => {
  const { total, listItem } = route.params;
  const [user, setuser] = useState({});
  const day = new Date().getDay();
  const month = new Date().getMonth();
  const [ship, setship] = useState(true);
  const [card, setcard] = useState(true);
  const [err, seterr] = useState(false);
  const [diaChi, setdiaChi] = useState("");
  const [soDienThoai, setsoDienThoai] = useState("");

  const retrieveData = async () => {
    try {
      const UserData = await AsyncStorage.getItem("@UserLogin");
      if (UserData != null) {
        const {
          status,
          data: { response },
        } = await axios.post(URL + "/users/getUser", { email: UserData });
        if (status == 200) {
          setuser(...response);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  useEffect(() => {
    retrieveData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require("../Image/back.png")} />
        </TouchableOpacity>
        <Text style={styles.headerText}>THANH TOÁN</Text>
        <View />
      </View>

      <ScrollView>
        <View style={styles.section}>
          <UnderLine value={"Thông tin khách hàng"} color={"black"} />
          <TextInput
            placeholder="Nhập họ tên"
            style={styles.input}
            value={user.fullname}
            editable={false}
          />
          <TextInput
            placeholder="Nhập email"
            style={styles.input}
            value={user.email}
            editable={false}
          />
          <TextInput
            placeholder="Nhập địa chỉ"
            style={styles.input}
            onChangeText={(txt) => setdiaChi(txt)}
          />
          {err && diaChi === "" && (
            <Text style={styles.errorText}>Vui lòng nhập địa chỉ</Text>
          )}
          <TextInput
            placeholder="Nhập số điện thoại"
            style={styles.input}
            onChangeText={(txt) => setsoDienThoai(txt)}
            keyboardType="numeric"
          />
          {err && soDienThoai === "" && (
            <Text style={styles.errorText}>Vui lòng nhập số điện thoại</Text>
          )}
          {err && isNaN(soDienThoai) && (
            <Text style={styles.errorText}>Số điện thoại chưa đúng</Text>
          )}
        </View>

        <View style={styles.section}>
          <UnderLine value={"Phương thức thanh toán"} color={"black"} />
          <Pressable onPress={() => setship(!ship)} style={styles.paymentOption}>
            <UnderLine
              value={"Giao hàng nhanh - 15.000đ"}
              color={"gray"}
              color2={ship ? "green" : "gray"}
              value2={`Dự kiến giao hàng ${day + 3}-${day + 5}/${month + 1}`}
            />
            {ship && <Image style={styles.checkIcon} source={require("../Image/select.png")} />}
          </Pressable>

          <Pressable onPress={() => setship(!ship)} style={styles.paymentOption}>
            <UnderLine
              value={"Giao hàng COD - 20.000đ"}
              color={"gray"}
              color2={!ship ? "green" : "gray"}
              value2={`Dự kiến giao hàng ${day + 2}-${day + 4}/${month + 1}`}
            />
            {!ship && <Image style={styles.checkIcon} source={require("../Image/select.png")} />}
          </Pressable>
        </View>

        <View style={styles.section}>
          <UnderLine value={"Hình thức thanh toán"} color={"black"} />
          <Pressable onPress={() => setcard(!card)} style={styles.paymentOption}>
            <UnderLine
              value={"Thẻ VISA/MASTERCARD"}
              color={"gray"}
              color2={card ? "green" : "gray"}
            />
            {card && <Image style={styles.checkIcon} source={require("../Image/select.png")} />}
          </Pressable>
          <Pressable onPress={() => setcard(!card)} style={styles.paymentOption}>
            <UnderLine value={"Thẻ ATM"} color={"gray"} color2={!card ? "green" : "gray"} />
            {!card && <Image style={styles.checkIcon} source={require("../Image/select.png")} />}
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.textBold}>Tạm tính :</Text>
            <Text style={styles.textBold}>{formatPrice(total)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.textBold}>Phí vận chuyển :</Text>
            <Text style={styles.textBold}>{ship ? "15.000 đ" : "20.000 đ"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng tiền :</Text>
            <Text style={styles.totalAmount}>
              {formatPrice(total + (ship ? 15000 : 20000))}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            soDienThoai && diaChi
              ? navigation.navigate("Payment2", {
                  user: user,
                  total: total,
                  ship: ship,
                  diaChi: diaChi,
                  soDienThoai: soDienThoai,
                  listItem: listItem,
                })
              : seterr(true);
          }}
          style={[
            styles.continueButton,
            {
              backgroundColor: soDienThoai && diaChi ? "#825640" : "gray",
            },
          ]}
        >
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
    
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#fdfdfd",
    fontSize: 16,
    textAlign: "left",  // Căn trái cho trường nhập liệu
  },
  errorText: {
    color: "#d9534f",
    fontSize: 13,
    marginBottom: 5,
    textAlign: "left",  // Căn trái cho thông báo lỗi
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#f2f2f2",
    borderBottomWidth: 1,
    textAlign: "left",  // Căn trái cho phương thức thanh toán
  },
  checkIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  summary: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  textBold: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "left",  // Căn trái cho thông tin tạm tính và phí vận chuyển
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",  // Căn trái cho tổng tiền
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d9534f",
    textAlign: "right",  // Căn phải cho tổng số tiền
  },
  continueButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#5cb85c",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  continueButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
