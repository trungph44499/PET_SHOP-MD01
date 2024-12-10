import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ItemHistory from "./components/item_history_pay";
import { getAllHistoryPay } from "./HistoryViewModel";

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [dataHistory, setDataHistory] = useState([]);
  const [selectedButton, setSelectedButton] = useState("pending"); // State để theo dõi nút được chọn

  useEffect(() => {
    (async function () {
      const data = await getAllHistoryPay("pending");
      setDataHistory(data.reverse());
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.icon}
            source={require("../../Image/left-back.png")}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Lịch sử mua hàng</Text>
      </View>
      <View >
        {/* Thanh cuộn ngang chứa các nút */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.buttonContainer}>
          {/* Các nút sẽ thay đổi màu khi được chọn */}
          <TouchableOpacity
            style={[styles.button, selectedButton === "pending" ? { borderBottomColor: "#EC6D42" } : {}]}
            onPress={async () => {
              const data = await getAllHistoryPay("pending");
              setDataHistory(data.reverse());
              setSelectedButton("pending"); // Đánh dấu nút "pending" được chọn
            }}
          >
            <Image
              source={require("../../Image/confirm.png")}
              style={[styles.iconButton, selectedButton === "pending" ? { tintColor: '#EC6D42' } : {}]}
            />
            <Text style={[styles.textButton, selectedButton === "pending" ? { color: '#EC6D42' } : {}]}>
              Chờ xác nhận
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, selectedButton === "success" ? { borderBottomColor: "#EC6D42" } : {}]}
            onPress={async () => {
              const data = await getAllHistoryPay("success");
              setDataHistory(data.reverse());
              setSelectedButton("success"); // Đánh dấu nút "success" được chọn
            }}
          >
            <Image
              source={require("../../Image/box.png")}
              style={[styles.iconButton, selectedButton === "success" ? { tintColor: '#EC6D42' } : {}]}
            />
            <Text style={[styles.textButton, selectedButton === "success" ? { color: '#EC6D42' } : {}]}>
              Chờ Lấy Hàng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, selectedButton === "shipping" ? { borderBottomColor: "#EC6D42" } : {}]}
            onPress={async () => {
              const data = await getAllHistoryPay("shipping");
              setDataHistory(data.reverse());
              setSelectedButton("shipping"); // Đánh dấu nút "shipping" được chọn
            }}
          >
            <Image
              source={require("../../Image/truck.png")}
              style={[styles.iconButton, selectedButton === "shipping" ? { tintColor: '#EC6D42' } : {}]}
            />
            <Text style={[styles.textButton, selectedButton === "shipping" ? { color: '#EC6D42' } : {}]}>
              Chờ giao hàng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, selectedButton === "shipped" ? { borderBottomColor: "#EC6D42" } : {}]}
            onPress={async () => {
              const data = await getAllHistoryPay("shipped");
              setDataHistory(data.reverse());
              setSelectedButton("shipped"); // Đánh dấu nút "shipped" được chọn
            }}
          >
            <Image
              source={require("../../Image/package.png")}
              style={[styles.iconButton, selectedButton === "shipped" ? { tintColor: '#EC6D42' } : {}]}
            />
            <Text style={[styles.textButton, selectedButton === "shipped" ? { color: '#EC6D42' } : {}]}>
              Đã giao
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, selectedButton === "reject" ? { borderBottomColor: "#EC6D42" } : {}]}
            onPress={async () => {
              const data = await getAllHistoryPay("reject");
              setDataHistory(data.reverse());
              setSelectedButton("reject"); // Đánh dấu nút "reject" được chọn
            }}
          >
            <Image
              source={require("../../Image/delivery_cancel.png")}
              style={[styles.iconButton, selectedButton === "reject" ? { tintColor: '#EC6D42' } : {}]}
            />
            <Text style={[styles.textButton, selectedButton === "reject" ? { color: '#EC6D42' } : {}]}>
              Đã hủy
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>


      <ScrollView style={{ marginTop: 10 }}>
        {dataHistory.length > 0 ? (
          dataHistory.map((item) => (
            <ItemHistory
              key={item._id}
              item={item}
              getAllHistoryPay={getAllHistoryPay}
            />
          ))
        ) : (
          <Text style={styles.noDataText}>
            Không có lịch sử thanh toán nào.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    backgroundColor: "#FFFFFF"
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  buttonItem: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    marginHorizontal: 14,
    paddingBottom: 5,
    borderBottomColor: "transparent",
    borderBottomWidth: 2,
    alignItems: "center",
  },
  textButton: {
    textAlign: "center"
  },
  iconButton: {
    width: 25,
    height: 25,
  }
});
