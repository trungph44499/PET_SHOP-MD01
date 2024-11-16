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
import { validateSDT } from "./utils/stringUtils";

const Payment = ({ navigation, route }) => {
  const { total, listItem } = route.params;
  const [user, setUser] = useState({});
  const day = new Date().getDay();
  const month = new Date().getMonth();
  const [ship, setShip] = useState("Giao hàng nhanh - 15.000đ");
  const [paymentMethod, setPaymentMethod] = useState("Thẻ VISA/MASTERCARD"); // Mặc định là VISA/MASTERCARD
  const [err, setErr] = useState(false);
  const [diaChi, setDiaChi] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");

  console.log("tong tien: ", total);
  

  const retrieveData = async () => {
    try {
      const UserData = await AsyncStorage.getItem("@UserLogin");
      if (UserData != null) {
        const { status, data: { response } } = await axios.post(URL + "/users/getUser", { email: UserData });
        if (status == 200) {
          setUser(...response);
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
          <TextInput placeholder="Nhập họ tên" style={styles.input} value={user.fullname} editable={false} />
          <TextInput placeholder="Nhập email" style={styles.input} value={user.email} editable={false} />
          <TextInput placeholder="Nhập địa chỉ" style={styles.input} onChangeText={(txt) => setDiaChi(txt)} />
          {err && diaChi === "" && <Text style={styles.errorText}>Vui lòng nhập địa chỉ</Text>}
          <TextInput placeholder="Nhập số điện thoại" style={styles.input} onChangeText={(txt) => setSoDienThoai(txt)} keyboardType="numeric" />
          {err && soDienThoai === "" && <Text style={styles.errorText}>Vui lòng nhập số điện thoại</Text>}
          {err && !validateSDT(soDienThoai) && <Text style={styles.errorText}>Số điện thoại chưa đúng</Text>}
        </View>

        <View style={styles.section}>
          <UnderLine value={"Phương thức vận chuyển"} color={"black"} />
          <Pressable onPress={() => setShip("Giao hàng nhanh - 15.000đ")} style={styles.paymentOption}>
            <UnderLine
              value={"Giao hàng nhanh - 15.000đ"}
              color={"gray"}
              color2={ship === "Giao hàng nhanh - 15.000đ" ? "green" : "gray"}
              value2={`Dự kiến giao hàng ${day + 3}-${day + 5}/${month + 1}`}
            />
            {ship === "Giao hàng nhanh - 15.000đ" && <Image style={styles.checkIcon} source={require("../Image/select.png")} />}
          </Pressable>

          <Pressable onPress={() => setShip("Giao hàng COD - 20.000đ")} style={styles.paymentOption}>
            <UnderLine
              value={"Giao hàng COD - 20.000đ"}
              color={"gray"}
              color2={ship === "Giao hàng COD - 20.000đ" ? "green" : "gray"}
              value2={`Dự kiến giao hàng ${day + 2}-${day + 4}/${month + 1}`}
            />
            {ship === "Giao hàng COD - 20.000đ" && <Image style={styles.checkIcon} source={require("../Image/select.png")} />}
          </Pressable>
        </View>

        <View style={styles.section}>

          <UnderLine value={"Hình thức thanh toán"} color={"black"} />

          {/* Thẻ VISA/MASTERCARD */}
          <Pressable onPress={() => setPaymentMethod("Thẻ VISA/MASTERCARD")} style={styles.paymentOption}>
            <UnderLine
              value={"Thẻ VISA/MASTERCARD"}
              color={"gray"}
              color2={paymentMethod === "Thẻ VISA/MASTERCARD" ? "green" : "gray"}
            />
            {paymentMethod === "Thẻ VISA/MASTERCARD" && <Image style={styles.checkIcon} source={require("../Image/select.png")} />}
          </Pressable>

          {/* Thẻ ATM */}
          <Pressable onPress={() => setPaymentMethod("Thẻ ATM")} style={styles.paymentOption}>
            <UnderLine
              value={"Thẻ ATM"}
              color={"gray"}
              color2={paymentMethod === "Thẻ ATM" ? "green" : "gray"}
            />
            {paymentMethod === "Thẻ ATM" && <Image style={styles.checkIcon} source={require("../Image/select.png")} />}
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.textBold}>Tạm tính :</Text>
            <Text style={styles.textBold}>{formatPrice(parseInt(total))}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.textBold}>Phí vận chuyển :</Text>
            <Text style={styles.textBold}>{ship === "Giao hàng nhanh - 15.000đ" ? "15.000đ" : "20.000đ"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng tiền :</Text>
            <Text style={styles.totalAmount}>{formatPrice(parseInt(total) + (ship === "Giao hàng nhanh - 15.000đ" ? parseInt(15000) : parseInt(20000)))}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            soDienThoai && diaChi && validateSDT(soDienThoai)
              ? navigation.navigate("Payment2", { user, total, ship, diaChi, soDienThoai, paymentMethod, listItem })
              : setErr(true);
          }}
          style={[styles.continueButton, { backgroundColor: soDienThoai && diaChi ? "#a97053" : "gray" }]}
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
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "white",

  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  section: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,

  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 8,
  },
  errorText: {
    color: "#d9534f",
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 10
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#eaeaea",
    borderBottomWidth: 1,
    width: "100%", // Đảm bảo phần tử chiếm đầy chiều rộng
  },

  checkIcon: {
    width: 18,
    height: 18,
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  textBold: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d9534f",
  },
  continueButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
