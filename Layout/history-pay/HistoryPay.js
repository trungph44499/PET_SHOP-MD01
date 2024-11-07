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
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.icon} source={require("../../Image/back.png")} />
        </TouchableOpacity>
        <Text style={styles.headerText}>History Buy</Text>
        <View />
      </View>
      <ScrollView>
        {dataHistory.length > 0 &&
          dataHistory.map((item) => (
            <ItemHistory item={item} getAllHistoryPay={getAllHistoryPay} />
          ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 15,
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
