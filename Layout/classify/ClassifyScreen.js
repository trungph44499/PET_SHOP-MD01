import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getListClassify } from "./function";
import { numberUtils, upperCaseFirstItem } from "../utils/stringUtils";

export default ClassifyScreen = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const { type } = route.params;

  async function getData() {
    const result = await getListClassify(type);
    setData(result);
    setFilteredData(result);
  }

  useEffect(() => {
    getData();
  }, []);

  const showAllProducts = () => {
    setShowNewOnly(false);
    setFilteredData(data);
  };


  const filterNewProducts = () => {
    setShowNewOnly(true);
    const newProducts = data.filter(item => item.status === "New");
    setFilteredData(newProducts);
  };

  function goToDetailScreen(item) {
    navigation.navigate("DetailScreen", { item: item });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../../Image/back.png")}
          />
        </TouchableOpacity>
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
          {upperCaseFirstItem(type) + "s"}
        </Text>
        <TouchableOpacity
          style={{ width: 50 }}
          onPress={() => navigation.navigate("CartScreen")}
        >
          <Image
            style={{ width: 26, height: 26 }}
            source={require("../../Image/cart.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", gap: 30, marginHorizontal: 20 }}>
        <TouchableOpacity
          onPress={showAllProducts}
          style={{
            backgroundColor: !showNewOnly ? "#73B5F7" : "transparent",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: showNewOnly ? "#7D7B7B" : "#FFFFFF" }}>Tất cả</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={filterNewProducts}
          style={{
            backgroundColor: showNewOnly ? "#73B5F7" : "transparent",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: showNewOnly ? "#FFFFFF" : "#7D7B7B" }}>Hàng mới về</Text>
        </TouchableOpacity>
      </View>


      <FlatList
        numColumns={2}
        data={filteredData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToDetailScreen(item)}
            style={styles.itemDog}
          >
            <Image source={{ uri: item.img }} style={styles.itemImage} />
            <View style={styles.itemRow}>
              {/* Hiển thị tên sản phẩm */}
              <Text style={styles.itemName}>
                {item.name}
              </Text>
              {/* Nếu trạng thái sản phẩm là "New", hiển thị nhãn "New" trong thẻ Text riêng */}
              {item.status === "New" && (
                <Text style={styles.itemStatus}>
                  {item.status}
                </Text>
              )}
            </View>
            <Text style={styles.itemType}>Mã SP: {upperCaseFirstItem(item._id.slice(-5))}</Text>
            <Text style={styles.price}>{numberUtils(item.price)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  itemDog: {
    backgroundColor: "white",
    width: "45%",
    borderRadius: 12,
    padding: 12,
    margin: 10,
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
  itemImage: {
    width: "100%",
    height: 130,
    borderRadius: 12,
  },
  itemName: {
    fontSize: 17,
    fontWeight: "bold",
  },
  itemStatus: {
    fontSize: 17,
    fontStyle: "italic",
    color: "green",
    fontWeight: "bold", // Làm cho chữ đậm hơn
    backgroundColor: "#e0f7e0", // Nền màu nhẹ
    borderRadius: 5, // Bo góc
    padding: 2, // Thêm khoảng cách bên trong
    marginLeft: 5, // Khoảng cách với tên sản phẩm
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap", // Cho phép nội dung bọc lại khi không đủ chỗ
    // marginVertical: 1, // Khoảng cách giữa các dòng
  },
  itemType: {
    fontSize: 15,
    fontWeight: "300",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "red",
  },
});