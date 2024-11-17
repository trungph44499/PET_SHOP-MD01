import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import UnderLine from "../../components/UnderLine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL } from "../HomeScreen";
import axios from "axios";
import { numberUtils, upperCaseFirstItem } from "../utils/stringUtils";
import CheckBoxCustom from "../components/CheckBoxCustom";

const Payment = ({ navigation, route }) => {
  const { total, listItem } = route.params;
  const day = new Date().getDay();
  const month = new Date().getMonth();
  const [ship, setShip] = useState("Giao hàng nhanh - 15.000đ");
  const [shippingAddresses, setShippingAddresses] = useState({});
  const [checkboxSeletectPayment, setCheckboxSelectPayment] = useState(-1);
  const [paymentMethods, setPaymentMethods] = useState({});

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
            source={require("../../Image/back.png")}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>THANH TOÁN</Text>
        <View />
      </View>

      <ScrollView>
        <View style={styles.section}>
          <UnderLine value={"Địa chỉ nhận hàng"} color={"black"} />

          {JSON.stringify(shippingAddresses) === "{}" ? (
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
                  source={require("../../Image/backk.png")}
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
                          fontSize: 14,
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
                        Địa chỉ: {shippingAddresses.address},
                        {shippingAddresses.city}
                      </Text>
                    </View>
                  </View>
                </View>
                <Image
                  style={styles.deleteIcon}
                  source={require("../../Image/backk.png")}
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
                borderRadius: 5,
                backgroundColor: "#fff",
                elevation: 5,
                paddingVertical: 10,
                paddingLeft: 20,
                paddingRight: 10,
                flex: 1,
                marginHorizontal: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.bold}>Thanh toán khi nhận hàng</Text>
                <Image
                  style={styles.deleteIcon}
                  source={require("../../Image/backk.png")}
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
            {JSON.stringify(paymentMethods) === "{}" ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PaymentMethod");
                }}
                style={{
                  marginBottom: 10,
                  borderRadius: 5,
                  backgroundColor: "#fff",
                  elevation: 5,
                  paddingVertical: 10,
                  paddingLeft: 20,
                  paddingRight: 10,
                  flex: 1,
                  marginHorizontal: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.bold}>Thêm thẻ thanh toán</Text>
                  <Image
                    style={styles.deleteIcon}
                    source={require("../../Image/backk.png")}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PaymentMethod");
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
                      style={[styles.deleteIcon, { tintColor: "blue" }]}
                      source={require("../../Image/visa.png")}
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
                          {paymentMethods.cardHolderName}
                        </Text>
                        <Text
                          style={{
                            fontWeight: "300",
                            fontSize: 14,
                            marginTop: 3,
                          }}
                        >
                          {paymentMethods.expirationDate}
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
                          Số thẻ: **** *** {paymentMethods.cardNumber.slice(-3)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Image
                    style={styles.deleteIcon}
                    source={require("../../Image/backk.png")}
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
            <Text style={styles.textBold}>{formatPrice(total)}</Text>
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
                total + (ship === "Giao hàng nhanh - 15.000đ" ? 15000 : 20000)
              )}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            console.log(listItem);
          }}
          style={[styles.continueButton, { backgroundColor: "#a97053" }]}
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
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
  deleteIcon: {
    width: 20,
    height: 20,
    marginTop: 2,
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
  itemQuantity: {
    color: "#555",
  },
});
