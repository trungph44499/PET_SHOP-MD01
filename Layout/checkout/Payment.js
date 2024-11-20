import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import UnderLine from "../../components/UnderLine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL } from "../HomeScreen";
import axios from "axios";
import { numberUtils, upperCaseItem } from "../utils/stringUtils";
import CheckBoxCustom from "../components/CheckBoxCustom";
import { Toast } from "../utils/toastUtil";
import { Alert } from "react-native";  // Import Alert

const Payment = ({ navigation, route }) => {
  const { total, listItem } = route.params;
  const day = new Date().getDay();
  const month = new Date().getMonth();

  const [ship, setShip] = useState("Giao hàng nhanh - 15.000đ");
  const [shippingAddresses, setShippingAddresses] = useState({});
  const [checkboxSeletectPayment, setCheckboxSelectPayment] = useState(-1);
  const [paymentMethods, setPaymentMethods] = useState({});

  const checkShippingAddresses = JSON.stringify(shippingAddresses) === "{}";
  const checkPaymentMethod = JSON.stringify(paymentMethods) === "{}";

  const totalPrice = parseInt(total);

  async function _payment() {
    try {
      let _userEmail = await AsyncStorage.getItem("@UserLogin");
      if (!_userEmail) {
        Toast("Không tìm thấy người dùng");
        return;
      }
      if (checkShippingAddresses) {
        Toast("Chưa chọn địa chỉ nhận hàng");
        return;
      }

      if (checkboxSeletectPayment != 1 && checkboxSeletectPayment != 0) {
        Toast("Chưa chọn phương thức thanh toán");
        return;
      }

      if (checkboxSeletectPayment === 1 && checkPaymentMethod) {
        Toast("Chưa chọn thẻ VISA");
        return;
      }

      // Hiển thị thông báo xác nhận
      Alert.alert(
        "Xác nhận thanh toán",
        "Bạn có chắc chắn muốn thanh toán không?",
        [
          {
            text: "Hủy",
            onPress: () => console.log("Thanh toán bị hủy"),
            style: "cancel",
          },
          {
            text: "Đồng ý",
            onPress: async () => {
              // Thực hiện thanh toán nếu người dùng nhấn "Đồng ý"
              let _paymentObject = {
                fullname: shippingAddresses.fullName,
                email: _userEmail,
                location: `${shippingAddresses.address}, ${shippingAddresses.city}`,
                number: shippingAddresses.phoneNumber,
                ship: ship,
                paymentMethod: checkboxSeletectPayment == 0 ? "Thanh toán khi nhận hàng" : "Thẻ VISA/MASTERCARD",
                totalPrice: totalPrice,
                products: listItem,
              };

              const {
                status,
                data: { response, type },
              } = await axios.post(`${URL}/pay/add`, _paymentObject);
              if (status === 200) {
                Toast(response);
                if (type) {
                  const {
                    status: _status,
                    data: { type: _type },
                  } = await axios.post(`${URL}/carts/removeAllFromCart`, {
                    list: listItem,
                    emailUser: _userEmail,
                  });
                  navigation.popToTop();
                }
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(error);
    }
  }

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const userEmail = await AsyncStorage.getItem("@UserLogin");

        const storedPaymentMethods = await AsyncStorage.getItem(
          userEmail + "_paymentMethods"
        );

        let paymentSavedIndex = await AsyncStorage.getItem(
          userEmail + "PaymentSaved"
        );

        if (storedPaymentMethods && paymentSavedIndex) {
          setPaymentMethods(
            JSON.parse(storedPaymentMethods)[paymentSavedIndex]
          );
        } else {
          setPaymentMethods({});
        }

        const storedShippingAddresses = await AsyncStorage.getItem(
          userEmail + "_shippingAddresses"
        );
        let shippingSavedIndex = await AsyncStorage.getItem(
          userEmail + "ShippingSaved"
        );

        if (storedShippingAddresses && shippingSavedIndex) {
          setShippingAddresses(
            JSON.parse(storedShippingAddresses)[shippingSavedIndex]
          );
        } else {
          setShippingAddresses({});
        }
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ giao hàng:", error);
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.backIcon}
            source={require("../../Image/left-back.png")}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>THANH TOÁN</Text>
        <View />
      </View>

      <ScrollView>
        <View style={styles.section}>
          <UnderLine value={"Địa chỉ nhận hàng"} color={"black"} />

          {checkShippingAddresses ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ShippingAddrees");
              }}
              style={{
                marginBottom: 10,
                marginHorizontal: 5,
                borderRadius: 5,
                backgroundColor: "#fff",
                elevation: 5,
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.bold}>Thêm địa chỉ nhận hàng</Text>
                <Image
                  style={styles.deleteIcon}
                  source={require("../../Image/left.png")}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ShippingAddrees");
              }}
              style={{
                marginBottom: 10,
                marginHorizontal: 5,
                borderRadius: 5,
                backgroundColor: "#fff",
                elevation: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Image
                    style={styles.deleteIcon}
                    source={require("../../Image/location.png")}
                  />
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          marginHorizontal: 5,
                        }}
                      >
                        {shippingAddresses.fullName}
                      </Text>
                      <Text
                        style={{
                          fontWeight: "300",
                          fontSize: 18,
                        }}
                      >
                        {shippingAddresses.phoneNumber}
                      </Text>
                    </View>
                    <View style={{ height: 5 }} />
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.bold}>
                        Địa chỉ: {shippingAddresses.address}, {shippingAddresses.city}
                      </Text>
                    </View>
                  </View>
                </View>
                <Image
                  style={styles.deleteIcon}
                  source={require("../../Image/left.png")}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.section}>
          <UnderLine value={"Danh sách sản phẩm"} color={"black"} />
          {listItem &&
            listItem.map((item) => (
              <View key={item.id} style={styles.item}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemCode}>
                    Mã sản phẩm: {upperCaseItem(item.id.slice(-5))}
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

        <View style={styles.section}>
          <UnderLine value={"Phương thức vận chuyển"} color={"black"} />
          <Pressable
            onPress={() => setShip("Giao hàng nhanh - 15.000đ")}
            style={styles.paymentOption}
          >
            <UnderLine
              value={"Giao hàng nhanh - 15.000đ"}
              color={"gray"}
              color2={ship === "Giao hàng nhanh - 15.000đ" ? "green" : "gray"}
              value2={`Dự kiến giao hàng ${day + 3}-${day + 5}/${month + 1}`}
            />
            {ship === "Giao hàng nhanh - 15.000đ" && (
              <Image
                style={styles.checkIcon}
                source={require("../../Image/select.png")}
              />
            )}
          </Pressable>

          <Pressable
            onPress={() => setShip("Giao hàng COD - 20.000đ")}
            style={styles.paymentOption}
          >
            <UnderLine
              value={"Giao hàng COD - 20.000đ"}
              color={"gray"}
              color2={ship === "Giao hàng COD - 20.000đ" ? "green" : "gray"}
              value2={`Dự kiến giao hàng ${day + 2}-${day + 4}/${month + 1}`}
            />
            {ship === "Giao hàng COD - 20.000đ" && (
              <Image
                style={styles.checkIcon}
                source={require("../../Image/select.png")}
              />
            )}
          </Pressable>
        </View>

        <View style={styles.section}>
          <UnderLine value={"Phương thức thanh toán"} color={"black"} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
              justifyContent: "space-between",
            }}
          >
            <CheckBoxCustom
              value={checkboxSeletectPayment === 0 ? true : false}
              onChangeCheckBox={() => {
                setCheckboxSelectPayment(0);
              }}
            />
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: 60,
                marginBottom: 10,
                marginHorizontal: 5,
                borderRadius: 5,
                backgroundColor: "#fff",
                elevation: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <Text style={{ flex: 1, fontSize: 16 }}>Thanh toán khi nhận hàng</Text>
                <Image
                  style={styles.leftIcon}
                  source={require("../../Image/left.png")}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CheckBoxCustom
              value={checkboxSeletectPayment === 1 ? true : false}
              onChangeCheckBox={() => {
                setCheckboxSelectPayment(1);
              }}
            />
            {checkPaymentMethod ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PaymentMethod");
                }}
                style={{
                  flex: 1,
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                  marginHorizontal: 5,
                  borderRadius: 5,
                  backgroundColor: "#fff",
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 10
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 16 }}>Thêm thẻ thanh toán</Text>
                  <Image
                    style={styles.leftIcon}
                    source={require("../../Image/left.png")}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PaymentMethod");
                }}
                style={{
                  flex: 1,
                  height: 60,
                  marginBottom: 10,
                  marginHorizontal: 5,
                  borderRadius: 5,
                  backgroundColor: "#fff",
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: 'center',
                      flex: 1
                    }}
                  >
                    <Image
                      style={[styles.iconCard,]}
                      source={require("../../Image/card.png")}
                    />
                    <Image
                      style={[styles.iconCard, { tintColor: "blue" }]}
                      source={require("../../Image/visa.png")}
                    />
                    <Text style={styles.textCard}>**** **** **** {paymentMethods.cardNumber.slice(-4)}
                    </Text>
                  </View>
                  <Image
                    style={styles.leftIcon}
                    source={require("../../Image/left.png")}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.textBold}>Tạm tính :</Text>
            <Text style={styles.textBold}>{formatPrice(totalPrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.textBold}>Phí vận chuyển :</Text>
            <Text style={styles.textBold}>
              {ship === "Giao hàng nhanh - 15.000đ" ? "15.000đ" : "20.000đ"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng tiền :</Text>
            <Text style={styles.totalAmount}>
              {formatPrice(
                totalPrice + (ship === "Giao hàng nhanh - 15.000đ" ? 15000 : 20000)
              )}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={_payment}
          style={[styles.continueButton, { backgroundColor: "#a97053" }]}
        >
          <Text style={styles.continueButtonText}>Thanh toán</Text>
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
    marginLeft: 10,
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 5,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  checkIcon: {
    width: 18,
    height: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  iconCard: {
    width: 40,
    height: 40,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    marginTop: 2,
  },
  leftIcon: {
    width: 20,
    height: 20,
  },
  textCard: {
    fontSize: 16,
    color: "#808080",
    fontWeight: "regular",
    marginLeft: 10
  },
  bold: {
    fontSize: 16,
    color: "#808080",
    fontWeight: "regular",
    width: "80%",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  itemName: {
    color: "#555",
    fontSize: 16,
  },
  itemPrice: {
    color: "#FF6B6B",
    fontSize: 16,
  },
  itemQuantity: {
    color: "#555",
    fontSize: 16,
  },
});
