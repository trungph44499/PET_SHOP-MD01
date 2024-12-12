import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
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
  const [selectedButton, setSelectedButton] = useState("all"); // Lưu ID của nút lọc đang được chọn
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

    // Lọc sản phẩm mới nếu nút "Mới nhất" được chọn
    if (selectedButton === "new") {
      updatedData = updatedData.filter(item => item.status === "New");
    }

    // Sắp xếp theo giá nếu nút "Giá" được chọn
    if (selectedButton === "priceAsc") {
      updatedData.sort((a, b) => a.size[0].price - b.size[0].price); // Giá tăng dần
    } else if (selectedButton === "priceDesc") {
      updatedData.sort((a, b) => b.size[0].price - a.size[0].price); // Giá giảm dần
    }

    // Sắp xếp theo bán chạy nhất (item.sold) nếu nút "Bán chạy" được chọn
    if (selectedButton === "bestSelling") {
      updatedData.sort((a, b) => b.sold - a.sold); // Sắp xếp bán chạy từ cao đến thấp
    }

    setFilteredData(updatedData); // Cập nhật dữ liệu đã lọc và sắp xếp
  };

  // Hiển thị tất cả sản phẩm
  const showAllProducts = () => {
    setSelectedButton("all");
    setFilteredData(data); // Hiển thị tất cả sản phẩm
  };

  // Hiển thị sản phẩm mới
  const filterNewProducts = () => {
    setSelectedButton("new");
    setFilteredData(data.filter(item => item.status === "New")); // Lọc sản phẩm mới
  };

  // Sắp xếp theo giá giảm
  const sortByPriceDesc = () => {
    setSelectedButton("priceDesc");
    filterAndSortData(); // Sắp xếp theo giá giảm
  };

  // Sắp xếp theo giá tăng
  const sortByPriceAsc = () => {
    setSelectedButton("priceAsc");
    filterAndSortData(); // Sắp xếp theo giá tăng
  };

  // Sắp xếp theo bán chạy
  const sortByBestSelling = () => {
    setSelectedButton("bestSelling");
    filterAndSortData(); // Sắp xếp theo bán chạy nhất
  };

  // Chuyển đến màn hình chi tiết sản phẩm
  function goToDetailScreen(item) {
    navigation.navigate("DetailScreen", { item: item });
  }

  // Sử dụng useEffect để tự động gọi filterAndSortData khi selectedButton thay đổi
  useEffect(() => {
    filterAndSortData();
  }, [selectedButton, data]);

  const ProductItem = React.memo(({ item, onPress }) => {
    return (
      <TouchableOpacity onPress={() => onPress(item)} style={styles.itemDog}>
        <Image source={{ uri: item.img }} style={styles.itemImage} />
        {item.status === "New" && <Text style={styles.itemStatus}>{item.status}</Text>}
        <View style={styles.itemRow}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
        </View>
        <Text style={styles.itemType}>Mã SP: {upperCaseItem(item._id.slice(-5))}</Text>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.price}>{numberUtils(item.size[0].price)}</Text>
          <Text style={styles.daBan}>Đã bán: {item.sold}</Text>
        </View>
      </TouchableOpacity>
    );
  });


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{ width: 20, height: 20 }} source={require("../../Image/left-back.png")} />
        </TouchableOpacity>
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
          {upperCaseFirstItem(getCategoryName(type))} {/* Hiển thị tên danh mục */}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
          <Image style={{ width: 26, height: 26 }} source={require("../../Image/cart.png")} />
        </TouchableOpacity>
      </View>
      <View>
        {/* Thanh cuộn ngang chứa các nút lọc */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.buttonRow}>
          <TouchableOpacity
            onPress={showAllProducts}
            style={[
              styles.filterButton,
              selectedButton === "all" ? { borderBottomColor: "#EC6D42" } : {},
            ]}
          >
            <Text style={[styles.filterButtonText, selectedButton === 'all' ? { color: "#EC6D42" } : {}]}>
              Tất cả</Text>
          </TouchableOpacity>
          <Text style={styles.textButton}>|</Text>
          <TouchableOpacity
            onPress={filterNewProducts}
            style={[
              styles.filterButton,
              selectedButton === "new" ? { borderBottomColor: "#EC6D42" } : {},
            ]}
          >
            <Text style={[styles.filterButtonText, selectedButton === 'new' ? { color: "#EC6D42" } : {}]}>
              Mới nhất</Text>
          </TouchableOpacity>
          <Text style={styles.textButton}>|</Text>
          <TouchableOpacity
            onPress={sortByBestSelling}
            style={[
              styles.filterButton,
              selectedButton === "bestSelling" ? { borderBottomColor: "#EC6D42" } : {},
            ]}
          >
            <Text style={[styles.filterButtonText, selectedButton === 'bestSelling' ? { color: "#EC6D42" } : {}]}>
              Bán chạy</Text>
          </TouchableOpacity>
          <Text style={styles.textButton}>|</Text>
          <TouchableOpacity
            onPress={sortByPriceDesc}
            style={[
              styles.filterButton,
              selectedButton === "priceDesc" ? { borderBottomColor: "#EC6D42" } : {},
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.filterButtonText, selectedButton === 'priceDesc' ? { color: "#EC6D42" } : {}]}>
                Giá
              </Text>
              <Image style={{ marginLeft: 5, width: 13, height: 13, tintColor: selectedButton === 'priceDesc' ? "#EC6D42" : "black", }}
                source={require("../../Image/item_down.png")} />
            </View>
          </TouchableOpacity>
          <Text style={styles.textButton}>|</Text>
          <TouchableOpacity
            onPress={sortByPriceAsc}
            style={[
              styles.filterButton,
              selectedButton === "priceAsc" ? { borderBottomColor: "#EC6D42" } : {},
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.filterButtonText, selectedButton === 'priceAsc' ? { color: "#EC6D42" } : {}]}>
                Giá
              </Text>
              <Image style={{ marginLeft: 5, width: 13, height: 13, tintColor: selectedButton === 'priceAsc' ? "#EC6D42" : "black", }}
                source={require("../../Image/item_up.png")} />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <FlatList
        numColumns={2}
        data={filteredData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ProductItem item={item} onPress={goToDetailScreen} />
        )}
        showsVerticalScrollIndicator={false}  // Tắt thanh cuộn dọc bên phải
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
    width: '47%',
    borderRadius: 10,
    padding: 10,
    margin: 6,
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
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    overflow: 'hidden',
    width: '100%',  // Đảm bảo chiếm toàn bộ chiều rộng của cha
  },
  itemStatus: {
    position: "absolute",
    top: '58%',
    right: '8%',
    fontSize: 14,
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
    fontSize: 10,
    fontWeight: "300",
    marginBottom: 5,
  },
  price: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "red",
  },
  daBan: {
    fontSize: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",  // Đảm bảo các nút lọc sẽ được căn theo chiều ngang
    alignItems: "center",
  },
  filterButton: {
    width: 90,
    marginVertical: 10,
    paddingBottom: 10,
    borderBottomColor: "transparent",
    borderBottomWidth: 2,
    alignItems: "center",
  },
  textButton: {
    fontSize: 20,
    fontWeight: "100",
    color: "gray",
    marginVertical: 10,
    paddingBottom: 10,

  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
