import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { URL } from "../HomeScreen";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ItemHistory from "./components/item_history_pay";
import { useState } from "react";

export default function () {
  const navigation = useNavigation();
  const [dataHistory, setDataHistory] = useState([]);

  async function getAllHistoryPay() {
    try {
      const email = await AsyncStorage.getItem("@UserLogin");
      const { status, data } = await axios.get(`${URL}/pay/filter`, {
        params: {
          email: email,
        },
      });
      if (status == 200) {
        setDataHistory(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllHistoryPay();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.icon} source={require("../../Image/back.png")} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Lịch sử thanh toán</Text>
        <View />
      </View>
      <ScrollView>
        {dataHistory.length > 0 &&
          dataHistory.map((item) => (
            <ItemHistory
              key={item._id}
              item={item}
              getAllHistoryPay={getAllHistoryPay}
            />
          ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
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
});
