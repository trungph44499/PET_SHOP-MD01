import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import axios from "axios";
import { URL } from "./HomeScreen";
import { numberUtils, upperCaseFirstItem } from "./utils/stringUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailProduct = ({ navigation, route }) => {
  const { item } = route.params;

  const addToCart = async () => {
    try {
      const emailUser = await AsyncStorage.getItem("@UserLogin");

      if (item.quantity < 1) {
        ToastAndroid.show("Số lượng sản phẩm không đủ!", ToastAndroid.SHORT);
        return;
      }

      const response = await axios.post(`${URL}/carts/addToCart`, {
        emailUser,
        _id: item._id,
        img: item.img,
        name: item.name,
        type: item.type,
        price: item.price,
        quantity: item.quantity,
      });

      if (response.status === 200) {
        ToastAndroid.show(response.data.response, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(
          response.data.response || "Có lỗi xảy ra!",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        ToastAndroid.show(
          error.response.data.response || "Có lỗi xảy ra!",
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show("Có lỗi xảy ra!", ToastAndroid.SHORT);
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../Image/back.png")}
            />
          </TouchableOpacity>
          <Text
            style={{ width: '80%', textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {item.name}
          </Text>
          <TouchableOpacity
            style={{ width: 50 }}
            onPress={() => navigation.navigate("CartScreen")}
          >
            <Image
              style={{ width: 26, height: 26 }}
              source={require("../Image/cart.png")}
            />
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: item.img }}
          style={{ width: "100%", height: 300 }}
        />

        <View style={{ gap: 16, paddingHorizontal: 40 }}>
          <View
            style={{
              width: 180,
              padding: 8,
              borderRadius: 10,
              backgroundColor: "#825640",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>
              {upperCaseFirstItem(item._id.slice(-5))}
            </Text>
          </View>

          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#EB4F26" }}>
            {numberUtils(item.price)}{" "}
          </Text>

          <ScrollView style={{ height: 200, padding: 1 }}>
            <Text>
              Chi tiết sản phẩm
              {"\n"}_______________________________________________
            </Text>
            {item.origin && (
              <Text style={styles.txt}>
                Xuất xứ: {item.origin}
                {"\n"}_______________________________________________
              </Text>
            )}
            <Text style={styles.txt}>
              Số lượng:{" "}
              <Text style={{ color: "green", fontWeight: "bold" }}>
                còn {item.quantity} sp
              </Text>
              {"\n"}_______________________________________________{"\n"}
            </Text>
            <Text>Mô tả: {item.description}</Text>
          </ScrollView>
        </View>

        <TouchableOpacity
          onPress={addToCart}
          style={{
            borderRadius: 9,
            padding: 12,
            marginHorizontal: 20,
            alignItems: "center",
            backgroundColor: "#825640",
            position: "relative",
            bottom: 40,
            width: "90%",
            marginTop: 50,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Thêm vào giỏ hàng
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DetailProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  txt: {
    marginTop: 10,
  },
});
