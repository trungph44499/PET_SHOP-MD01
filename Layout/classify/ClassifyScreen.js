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
import { numberUtils, upperCaseFirstItem, upperCaseItem } from "../utils/stringUtils";
import axios from "axios";
import { URL } from "../HomeScreen";

export default ClassifyScreen = ({ navigation, route }) => {
  const [data, setData] = useState([]); // Dữ liệu sản phẩm
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu sản phẩm đã lọc
  const [categories, setCategories] = useState([]); // Lưu các loại sản phẩm (ProductCategory)
  const [showNewOnly, setShowNewOnly] = useState(false); // Lọc sản phẩm mới
  const [showPrice, setShowPrice] = useState(false); // Sắp xếp theo giá
  const { type, animals } = route.params; // type là ID danh mục

  // Lấy danh sách danh mục
  async function getAllCategories() {
    try {
      const { status, data: { response } } = await axios.get(`${URL}/product-categories`);
      if (status === 200) {
        setCategories(response);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  }

  // Lấy dữ liệu sản phẩm
  async function getData() {
    const result = await getListClassify(type, animals);
    setData(result);
    setFilteredData(result);
  }

  useEffect(() => {
    getAllCategories(); // Lấy danh mục
    getData(); // Lấy dữ liệu sản phẩm
  }, []);

  // Tìm tên danh mục từ ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  // Hàm lọc và sắp xếp sản phẩm
  const filterAndSortData = () => {
    let updatedData = [...data];

    // Lọc sản phẩm mới nếu có
    if (showNewOnly) {
      updatedData = updatedData.filter(item => item.status === "New");
    }

    // Sắp xếp theo giá nếu có
    if (showPrice) {
      updatedData.sort((a, b) => {
        const priceA = a.size[0].price;
        const priceB = b.size[0].price;
        return priceA - priceB; // Tăng dần
      });
    } else {
      updatedData.sort((a, b) => {
        const priceA = a.size[0].price;
        const priceB = b.size[0].price;
        return priceB - priceA; // Giảm dần
      });
    }

    setFilteredData(updatedData); // Cập nhật dữ liệu đã lọc và sắp xếp
  };

  // Hiển thị tất cả sản phẩm
  const showAllProducts = () => {
    setShowNewOnly(false);
    setFilteredData(data); // Hiển thị tất cả sản phẩm
  };

  // Hiển thị sản phẩm mới
  const filterNewProducts = () => {
    setShowNewOnly(true);
    setFilteredData(data.filter(item => item.status === "New")); // Lọc sản phẩm mới
  };

  // Chuyển đến màn hình chi tiết sản phẩm
  function goToDetailScreen(item) {
    navigation.navigate("DetailScreen", { item: item });
  }

  // Sử dụng useEffect để tự động gọi filterAndSortData khi showPrice hoặc showNewOnly thay đổi
  useEffect(() => {
    filterAndSortData();
  }, [showPrice, showNewOnly, data]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../../Image/left-back.png")}
          />
        </TouchableOpacity>
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
          {upperCaseFirstItem(getCategoryName(type))} {/* Hiển thị tên danh mục */}
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

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={showAllProducts}
          style={{
            flex: 1,
            backgroundColor: !showNewOnly ? "#73B5F7" : "transparent",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            margin: 2,
          }}
        >
          <Text style={{ fontSize: 15, color: showNewOnly ? "#7D7B7B" : "#FFFFFF", fontWeight: "bold" }}>Tất cả</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={filterNewProducts}
          style={{
            flex: 1,
            backgroundColor: showNewOnly ? "#73B5F7" : "transparent",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            margin: 2,
          }}
        >
          <Text style={{ fontSize: 15, color: showNewOnly ? "#FFFFFF" : "#7D7B7B", fontWeight: "bold" }}>Hàng mới</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowPrice(false)} // Sắp xếp theo giá giảm
          style={{
            flex: 1,
            backgroundColor: !showPrice ? "#73B5F7" : "transparent",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            margin: 2,
          }}
        >
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={{ fontSize: 15, color: !showPrice ? "#FFFFFF" : "#7D7B7B", fontWeight: "bold" }}>Giá </Text>
            <Image
              style={{ width: 13, height: 13, tintColor: !showPrice ? "#FFFFFF" : "#7D7B7B", }}
              source={require("../../Image/item_down.png")}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowPrice(true)} // Sắp xếp theo giá tăng
          style={{
            flex: 1,
            backgroundColor: showPrice ? "#73B5F7" : "transparent",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            margin: 2,
          }}
        >
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={{ fontSize: 15, color: showPrice ? "#FFFFFF" : "#7D7B7B", fontWeight: "bold" }}>Giá </Text>
            <Image
              style={{ width: 13, height: 13, tintColor: showPrice ? "#FFFFFF" : "#7D7B7B", }}
              source={require("../../Image/item_up.png")}
            />
          </View>
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
              <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail">
                {item.name}
              </Text>
            </View>
            <Text style={styles.itemType}>Mã SP: {upperCaseItem(item._id.slice(-5))}</Text>
            <Text style={styles.price}>{numberUtils(item.size[0].price)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
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
    elevation: 5,
  },
  itemImage: {
    width: "100%",
    height: 130,
    borderRadius: 12,
    resizeMode: "contain"
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
    overflow: 'hidden',
    width: '100%',  // Đảm bảo chiếm toàn bộ chiều rộng của cha
  },
  itemStatus: {
    position: "absolute",
    top: '48%',
    right: '8%',
    fontSize: 18,
    fontStyle: "italic",
    color: "#FFFFFF",
    fontWeight: "bold", // Làm cho chữ đậm hơn
    backgroundColor: "#bcea82", // Nền màu nhẹ
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }
});
