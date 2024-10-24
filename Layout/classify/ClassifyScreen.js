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
import { upperCaseFirstItem } from "../utils/stringUtils";
import { numberUtils } from "../utils/stringUtils";

export default ClassifyScreen = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Thêm state để lọc dữ liệu
  const [showNewOnly, setShowNewOnly] = useState(false); // Thêm state để kiểm tra chế độ hiển thị
  const { type } = route.params;

  async function getData() {
    const result = await getListClassify(type);
    setData(result);
    setFilteredData(result); // Gán toàn bộ dữ liệu vào filteredData ban đầu
  }

  useEffect(() => {
    getData();
  }, []);

  // Hàm hiển thị tất cả sản phẩm
  const showAllProducts = () => {
    setShowNewOnly(false); // Đặt về chế độ hiển thị tất cả
    setFilteredData(data); // Hiển thị toàn bộ sản phẩm
  };

  // Hàm lọc chỉ sản phẩm mới
  const filterNewProducts = () => {
    setShowNewOnly(true); // Chuyển sang chế độ lọc sản phẩm mới
    const newProducts = data.filter(item => item.status === "New"); // Lọc sản phẩm có status "New"
    setFilteredData(newProducts); // Cập nhật filteredData với sản phẩm mới
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
        {/* Nút hiển thị tất cả sản phẩm */}
        <TouchableOpacity onPress={showAllProducts}>
          <Text style={{ color: !showNewOnly ? "red" : "black" }}>Tất cả</Text>
        </TouchableOpacity>

        {/* Nút lọc sản phẩm mới */}
        <TouchableOpacity onPress={filterNewProducts}>
          <Text style={{ color: showNewOnly ? "red" : "black" }}>Hàng mới về</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        numColumns={2}
        data={filteredData} // Sử dụng dữ liệu đã lọc
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToDetailScreen(item)}
            style={styles.itemDog}
          >
            <Image source={{ uri: item.img }} style={styles.itemImage} />
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.name}
                {item.status === "New" && (
                  <Text style={styles.itemStatus}> {item.status}</Text>
                )}
              </Text>
            </View>
            <Text style={styles.itemType}>Mã SP: {item._id.slice(-5)}</Text>
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
    fontSize: 18,
    fontWeight: "bold",
  },
  itemStatus: {
    fontSize: 18,
    fontStyle: "italic",
    color: "green",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemType: {
    fontSize: 13,
    fontWeight: "300",
  },
  price: {
    fontSize: 17,
    fontWeight: "600",
    color: "red",
  },
});
