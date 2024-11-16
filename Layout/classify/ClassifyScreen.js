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
          <Text style={{ color: showNewOnly ? "#7D7B7B" : "#FFFFFF", fontWeight: "bold" }}>Tất cả</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={filterNewProducts}
          style={{
            backgroundColor: showNewOnly ? "#73B5F7" : "transparent",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: showNewOnly ? "#FFFFFF" : "#7D7B7B", fontWeight: "bold" }}>Hàng mới về</Text>
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
            {item.status === "New" && (
                <Text style={styles.itemStatus}>
                  {item.status}
                </Text>
              )}
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.name}
              </Text>
          
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
    backgroundColor: '#FFFFFF',
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
    marginRight: 5, 
  },
  itemStatus: {
    position: "absolute",
    top: '48%',
    right: '8%',
    fontSize: 18,
    fontStyle: "italic",
    color: "green",
    fontWeight: "bold", // Làm cho chữ đậm hơn
    backgroundColor: "#e0f7e0", // Nền màu nhẹ
    borderRadius: 12, // Bo góc
    padding: 5, // Thêm khoảng cách bên trong
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    
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