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

  useEffect(() => {
    (async function () {
      const data = await getAllHistoryPay("pending");
      setDataHistory(data);
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
        <Text style={styles.headerText}>Lịch sử thanh toán</Text>
      </View>
      <View style={styles.buttonItem}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const data = await getAllHistoryPay("pending");
            setDataHistory(data);
          }}
        >
          <Image
            source={require("../../Image/box.png")}
            style={{ height: 25, width: 25 }}
          />
          <Text>Chờ xác nhận</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const data = await getAllHistoryPay("success");
            setDataHistory(data);
          }}
        >
          <Image
            source={require("../../Image/truck.png")}
            style={{ height: 25, width: 25 }}
          />
          <Text>Chờ giao hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const data = await getAllHistoryPay("shipping");
            setDataHistory(data);
          }}
        >
          <Image
            source={require("../../Image/box.png")}
            style={{ height: 25, width: 25 }}
          />
          <Text>Đang giao</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const data = await getAllHistoryPay("shipped");
            setDataHistory(data);
          }}
        >
          <Image
            source={require("../../Image/truck.png")}
            style={{ height: 25, width: 25 }}
          />
          <Text>Đã giao</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const data = await getAllHistoryPay("reject");
            setDataHistory(data);
          }}
        >
          <Image
            source={require("../../Image/truck.png")}
            style={{ height: 25, width: 25 }}
          />
          <Text>Đã hủy</Text>
        </TouchableOpacity>
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
    alignItems: "center",
  },
});
