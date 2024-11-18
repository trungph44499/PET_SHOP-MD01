import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
} from "react-native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SliderShow from "./components/SliderShow";
import { numberUtils, upperCaseFirstItem } from "./utils/stringUtils";
import ip from "./config/ipconfig.json";

export const URL = `http://${ip.ip}`;

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]); // Lưu các loại sản phẩm (ProductCategory)
  const [products, setProducts] = useState([]); // Lưu tất cả sản phẩm
  const [selectedCategory, setSelectedCategory] = useState(null); // Lưu danh mục sản phẩm đã chọn
  const [filteredProducts, setFilteredProducts] = useState([]); // Lưu danh sách sản phẩm đã lọc

  // Lấy tất cả các danh mục sản phẩm
  async function getAllCategories() {
    try {
      const { status, data: { response } } = await axios.get(`${URL}/product-categories`);
      if (status === 200) {
        // Lọc các danh mục có status là true
        const validCategories = response.filter(category => category.status === true);
        setCategories(validCategories); // Cập nhật các danh mục hợp lệ vào state
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  }
  // Lấy tất cả sản phẩm
  async function getListProduct() {
    try {
      const { status, data: { response } } = await axios.get(`${URL}/products`);
      if (status === 200) {
        setProducts(response); // Lưu tất cả sản phẩm vào state
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }

  useEffect(() => {
    getAllCategories();
    getListProduct();
  }, []);

  useEffect(() => {
    // Kiểm tra nếu không có category được chọn, chọn category đầu tiên
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]); // Chọn category đầu tiên
    }
  }, [categories]); // Chạy lại khi danh sách categories thay đổi

  useEffect(() => {
    // Lọc sản phẩm khi có sự thay đổi về selectedCategory hoặc products
    if (selectedCategory) {
      console.log("Selected Category ID: ", selectedCategory._id); // Log category ID
      const filtered = products.filter((product) => {
        return product.type._id === selectedCategory._id; // So sánh type và category ID
      });
      setFilteredProducts(filtered); // Cập nhật danh sách sản phẩm đã lọc
    } else {
      setFilteredProducts(products); // Nếu không có category được chọn, hiển thị tất cả sản phẩm
    }
  }, [selectedCategory, products]); // Trigger lại khi selectedCategory hoặc products thay đổi

  // Hàm điều hướng đến màn hình ClassifyScreen
  function goToClassifyScreen(type) {
    navigation.navigate("ClassifyScreen", { type: type });
  }
  function goToDetailScreen(item) {
    navigation.navigate("DetailScreen", { item: item });
  }

  function ItemCategory({ category }) {
    const isSelected = selectedCategory && selectedCategory._id === category._id;  // Kiểm tra xem category hiện tại có được chọn không

    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => {
          // console.log("Category selected: ", category);  // Log xem category khi chọn
          setSelectedCategory(category); // Cập nhật category đã chọn
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            height: 65,
            borderRadius: 10,
            backgroundColor: isSelected ? "#0FA2FF" : "#FBEEC2", // Cập nhật màu nền ở đây nếu cần
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
          }}
        >
          <Image source={{ uri: category.img }} style={styles.categoryImage} />
        </View>
        <Text
          style={styles.categoryName}
        >
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  }

  function ItemList(item) {
    return (
      <TouchableOpacity
        onPress={() => goToDetailScreen(item)}
        style={styles.itemDog}
      >
        <Image source={{ uri: item.img }} style={styles.itemImage} />
        {item.status === "New" && (
          <Text style={styles.itemStatus}>{item.status}</Text>
        )}
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemStyle}>
          Mã SP: {upperCaseFirstItem(item._id.slice(-5))}
        </Text>
        <Text style={styles.price}>{numberUtils(item.price)}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar hidden />
        <View style={{ width: screenWidth, height: 300 }}>
          <View style={{ marginTop: "3%", }}>
            <Text
              style={{
                color: "#000000",
                fontSize: 20,
                fontWeight: "450",
              }}
            >
              Welcome,
            </Text>
            <Text
              style={{
                color: "#000000",
                fontSize: 24,
                fontWeight: "600",
                marginBottom: 10,
             
              }}
            >
              Pet Shop
            </Text>
          </View>
          <SliderShow />
          <TouchableOpacity
            style={styles.newSP}
            onPress={() => navigation.navigate("NewProductScreen")}
          >
            <Text
              style={{
                fontSize: 17,
                color: "black",
                fontWeight: "bold",
                // textDecorationLine: "underline",
              }}
            >
              Xem hàng mới về ➭
            </Text>
          </TouchableOpacity>
        </View>
        {/* Hiển thị danh sách danh mục */}
        <View>
          <Text
            style={{
              color: "#000000",
              fontSize: 23,
              fontWeight: "bold",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            Category
          </Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => <ItemCategory category={item} />}
            keyExtractor={(item) => item._id}
            horizontal={true} // Cuộn ngang
            showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
            contentContainerStyle={styles.flatListContainer}
          />
        </View>

        {/* Hiển thị danh sách sản phẩm đã lọc */}
        <View>
          <FlatList
            numColumns={2}
            scrollEnabled={false}
            data={filteredProducts.slice(0, 6)} // Chỉ lấy 6 sản phẩm đầu tiên
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <ItemList {...item} />}
          />
          <TouchableOpacity
            onPress={() => goToClassifyScreen(selectedCategory ? selectedCategory._id : categories[0]._id)}
            style={styles.textXemthem}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#000000",
                fontWeight: "bold",
                textDecorationLine: "underline",
              }}
            >
              Xem thêm
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.cart}
        onPress={() => navigation.navigate("CartScreen")}
      >
        <Image
          source={require("../Image/cart.png")}
          style={{ height: 30, width: 30 }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  flatListContainer: {
    marginBottom: 5,
  },
  categoryItem: {
    marginRight: 15,
  },
  categoryImage: {
    width: 35,
    height: 35,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemDog: {
    backgroundColor: "white",
    width: "45%",
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    marginRight: 20,
    gap: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 2,
  },
  itemImage: {
    width: "100%",
    height: 140,
    borderRadius: 10,
  },
  itemStatus: {
    position: "absolute",
    top: "5%",
    left: "9%",
    backgroundColor: "#FF6347",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontWeight: "bold",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemStyle: {
    fontSize: 14,
    color: "#777",
  },
  price: {
    fontSize: 18,
    color: "#FF6347",
    fontWeight: "bold",
  },
  cart: {
    width: 50,
    height: 50,
    position: "absolute",
    top: "5%", // Khoảng cách từ trên cùng
    right: "7%", // Khoảng cách từ bên trái
    backgroundColor: "white",
    elevation: 10,
    padding: 10,
    borderRadius: 30,
  },
  textXemthem: {
    width: "100%",
    padding: 12,
    justifyContent: "flex-end",
    flexDirection: "row",
  }
});

export default HomeScreen;
