import React from "react";
import {
  Button,
  Image,
  ScrollView,
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
  
  function convertStatus(status) {
    let result = "";
    var statusColor = "";
    if (status == "pending") {
      result = "Chờ xác nhận";
      statusColor = "gray";
    }
    if (status == "success") {
      result = "Đã xác nhận";
      statusColor = "green";
    }
    if (status == "reject") {
      result = "Đã hủy";
      statusColor = "red";
    }
    return { result, statusColor };
  }

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
                status: "reject",
              });

              if (status == 200) {
                ToastAndroid.show(response, ToastAndroid.SHORT);
                if (type) getAllHistoryPay();
              }
            } catch (error) {
              console.log(error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={[styles.container]}>
      {item.products.map((e) => (
        <TouchableOpacity key={e.id} onPress={() => navigation.navigate("DetailHistoryPay", { item, e })}>
          <View style={styles.item}>
            <Image source={{ uri: e.image }} style={styles.image} />
            <View>
              <Text style={{ color: "gray" }}>
                Mã sản phẩm: {upperCaseFirstItem(e.id.slice(-5))}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontSize: 15, fontWeight: "bold", width: "50%" }}
              >
                {e.name}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Giá tiền: {numberUtils(e.price)}
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
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <View style={{flexDirection:'row'}}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          Trạng thái:
        </Text>
        <Text style={{ fontSize: 15, fontWeight: "bold", color: convertStatus(item.status).statusColor, textTransform: 'uppercase', left:2}}>
          {convertStatus(item.status).result}
        </Text>
        </View>
        

        <Button
          disabled={item.status != "pending"}
          onPress={() => rejectBuyProduct(item.email)}
          title="Hủy đơn hàng"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
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
  },
  container: {
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
});
