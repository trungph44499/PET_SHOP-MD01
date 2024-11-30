import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import { numberUtils, upperCaseFirstItem } from "../../utils/stringUtils";
import axios from "axios";
import { URL } from "../../HomeScreen";
import { useNavigation } from "@react-navigation/native";

export default function ({ item, getAllHistoryPay }) {
  const navigation = useNavigation();

  // Hàm chuyển đổi trạng thái đơn hàng
  function convertStatus(status) {
    let result = "";
    let statusColor = "";

    switch (status) {
      case "pending":
        result = "Chờ xác nhận";
        statusColor = "gray";
        break;
      case "success":
        result = "Chờ giao hàng";
        statusColor = "green";
        break;
      case "reject":
        result = "Đã hủy";
        statusColor = "red";
        break;
      case "shipping":
        result = "Đang giao";
        statusColor = "yellow";
        break;
      case "shipped":
        result = "Đã giao";
        statusColor = "violet";
        break;

      default:
        break;
    }
    return { result, statusColor };
  }

  // Xác nhận hủy đơn hàng
  function rejectBuyProduct() {
    Alert.alert(
      "Xác nhận hủy đơn hàng",
      "Bạn có chắc chắn muốn hủy đơn hàng không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              const {
                status,
                data: { response, type },
              } = await axios.post(`${URL}/pay/update`, {
                id: item._id,
                email: item.email,
                products: item.products,
                status: "reject",
              });

              if (status === 200) {
                ToastAndroid.show(response, ToastAndroid.SHORT);
                if (type) getAllHistoryPay();
              }
            } catch (error) {
              console.error(error);
              ToastAndroid.show(
                "Đã xảy ra lỗi khi hủy đơn hàng",
                ToastAndroid.SHORT
              );
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
      {item.products.map((e) => (
        <TouchableOpacity
          key={e.id}
          onPress={() => navigation.navigate("DetailHistoryPay", { item, e })}
        >
          <View style={styles.item}>
            <Image source={{ uri: e.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.itemName}
              >
                {e.name}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Giá tiền: {numberUtils(e.price)}
              </Text>
              <Text
                style={{ fontSize: 15, fontWeight: "bold" }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Kích thước: {e.size}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Số lượng : {e.quantity}
              </Text>
            </View>
            <View />
          </View>
        </TouchableOpacity>
      ))}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Trạng thái:</Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: convertStatus(item.status).statusColor,
              textTransform: "uppercase",
              marginLeft: 5,
            }}
          >
            {convertStatus(item.status).result}
          </Text>
        </View>

        {/* Button Hủy đơn hàng */}
        {/* <TouchableOpacity
          disabled={item.status !== "pending"}
          onPress={rejectBuyProduct}
          style={[
            styles.rejectButton,
            item.status !== "pending" && styles.disabledButton,
          ]}
        >
          <Text
            style={[
              styles.rejectButtonText,
              item.status !== "pending" && styles.disabledButtonText,
            ]}
          >
            Hủy đơn hàng
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 120,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#333",
    borderBottomWidth: 0.5,
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 15,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
    margin: 15,
    gap: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 10,
  },
  rejectButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  rejectButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#d3d3d3",
  },
  disabledButtonText: {
    color: "#a9a9a9",
  },
  itemName: {
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
    overflow: "hidden",
    width: "100%",
  },
});
