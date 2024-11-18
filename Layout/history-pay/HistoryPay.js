import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { URL } from "../HomeScreen";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ItemHistory from "./components/item_history_pay";
import { useFocusEffect } from "@react-navigation/native";

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [dataHistory, setDataHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hàm lấy dữ liệu lịch sử thanh toán
  async function getAllHistoryPay() {
    try {
      const email = await AsyncStorage.getItem("@UserLogin");
      if (!email) {
        setError("Không tìm thấy email người dùng.");
        setLoading(false);
        return;
      }
      const { status, data } = await axios.get(`${URL}/pay/filter`, {
        params: { email: email },
      });

      if (status === 200) {
        // Đảo ngược thứ tự mảng để dữ liệu mới nhất lên đầu
        setDataHistory(data.reverse());
      } else {
        setError("Không thể lấy dữ liệu lịch sử thanh toán.");
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }

  // Gọi hàm khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setError("");
      getAllHistoryPay();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.icon} source={require("../../Image/left-back.png")} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Lịch sử thanh toán</Text>
        <View />
      </View>

      {/* Hiển thị trạng thái loading */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
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
            <Text style={styles.noDataText}>Không có lịch sử thanh toán nào.</Text>
          )}
        </ScrollView>
      )}
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
});
