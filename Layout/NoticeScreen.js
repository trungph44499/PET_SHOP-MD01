import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { URL } from "./HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NoticeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Hàm lấy dữ liệu
  const getData = async () => {
    const email = await AsyncStorage.getItem("@UserLogin");

    // Gọi API để lấy dữ liệu
    const url = `${URL}/notification?email=${email}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setData(data.reverse()); // Lưu dữ liệu và đảo ngược
      } else {
        Alert.alert("Lỗi", "Không thể tải thông báo");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi kết nối", "Không thể kết nối đến máy chủ");
    }
  };

  // Hàm gọi lại dữ liệu khi người dùng kéo xuống (pull-to-refresh)
  const onRefresh = () => {
    setRefreshing(true);
    getData().then(() => setRefreshing(false)); // Khi lấy dữ liệu xong thì tắt refreshing
  };

  // Hàm chuyển đổi trạng thái
  function convertStatus(status) {
    var statusResult = "";
    var statusColor = "";
    switch (status) {
      case "reject":
        statusResult = "Đã từ chối";
        statusColor = "red";
        break;
      case "success":
        statusResult = "Đã xác nhận";
        statusColor = "green";
        break;
      case "pending":
        statusResult = "Chờ xác nhận";
        statusColor = "black";
        break;
      default:
        break;
    }
    return { statusResult, statusColor };
  }

  // Hàm chuyển đổi ngày giờ
  function convertDate(date) {
    let dateObj = new Date(date);

    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();

    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    let formattedDate = `${hours}:${minutes}, ${day}/${month}/${year}`;

    return formattedDate;
  }

  // Hàm render từng item trong danh sách
  const renderItem = ({ item }) => {
    return (
      <View style={styles.bgitem}>
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: convertStatus(item.status).statusColor,
                textTransform: "uppercase",
              }}
            >
              {convertStatus(item.status).statusResult}
            </Text>
            <Text style={{ fontSize: 16, textTransform: "uppercase" }}>
              {item.service.toUpperCase()}
            </Text>
            <Text style={{ fontSize: 14, textTransform: "uppercase" }}>
              {item.type}
            </Text>
            <Text>{convertDate(item.date)}</Text>
          </View>
        </View>
      </View>
    );
  };

  // useEffect để lấy dữ liệu ngay khi component được render lần đầu tiên
  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ height: 10 }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../Image/back.png")}
          />
        </TouchableOpacity>
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
          THÔNG BÁO
        </Text>
        <View />
      </View>

      {/* Hiển thị thông báo khi không có dữ liệu */}
      {data.length === 0 ? (
        <View>
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            Hiện chưa có thông báo nào cho bạn
          </Text>
        </View>
      ) : (
        // Hiển thị danh sách thông báo với pull-to-refresh
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default NoticeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  image: {
    width: 80,
    height: 80,
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 5,
  },
  bgitem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textContainer: {
    marginLeft: 10,
  },
});
