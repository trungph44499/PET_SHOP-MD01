import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { URL } from "./HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NoticeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 1000); // Fetch data every 60 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const getData = async () => {
    const email = await AsyncStorage.getItem("@UserLogin");
    const url = `${URL}/notification?email=${email}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setData(data.reverse()); // Reverse the data array here
    }
  };

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
        statusColor = "gray";
        break;
      default:
        break;
    }
    return { statusResult, statusColor };
  }

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

  const renderItem = ({ item }) => {
    return (
      <View style={styles.bgitem}>
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={{ fontSize: 16, color: convertStatus(item.status).statusColor, textTransform: 'uppercase' }}>
              {convertStatus(item.status).statusResult}
            </Text>
            <Text style={{ fontSize: 16, textTransform: 'uppercase' }}>{item.service.toUpperCase()}</Text>
            <Text style={{ fontSize: 14, textTransform: 'uppercase' }}>{item.type}</Text>
            <Text>{convertDate(item.date)}</Text>
          </View>
        </View>
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    getData().then(() => setRefreshing(false));
  };

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

      {data.length === 0 ? (
        <View>
          <Text style={{ textAlign: "center" }}>
            Hiện chưa có thông báo nào cho bạn
          </Text>
        </View>
      ) : (
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
    paddingLeft: 20,
    paddingRight: 20,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  bgitem: {
    marginBottom: 10,
  },
  textContainer: {
    marginLeft: 10,
  },
});
