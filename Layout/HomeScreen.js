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
import React, { useEffect, useState, useCallback } from "react";
import SliderShow from "./components/SliderShow";
import { numberUtils, upperCaseItem } from "./utils/stringUtils";
import ip from "./config/ipconfig.json";

export const URL = `http://${ip.ip}`;

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]); // Lưu các loại sản phẩm (ProductCategory)
  const [selectedCategory, setSelectedCategory] = useState(null); // Lưu danh mục sản phẩm đã chọn
  const [ListDogs, setListDogs] = useState([]);
  const [ListCats, setListCats] = useState([]);
  const [filteredDogs, setFilteredDogs] = useState([]);
  const [filteredCats, setFilteredCats] = useState([]);

  // Lấy tất cả các danh mục sản phẩm
  const getAllCategories = useCallback(async () => {
    try {
      const { status, data: { response } } = await axios.get(`${URL}/product-categories`);
      if (status === 200) {
        const validCategories = response.filter(category => category.status === true);
        setCategories(validCategories);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  }, []);

  // Lấy tất cả sản phẩm
  const getListProduct = useCallback(async () => {
    try {
      const { status, data: { response } } = await axios.get(`${URL}/products`);
      if (status === 200) {
        setListCats(response.filter((item) => item.animals === "cat"));
        setListDogs(response.filter((item) => item.animals === "dog"));
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    getAllCategories();
    getListProduct();
  }, [getAllCategories, getListProduct]);

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]); // Chọn category đầu tiên
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      const filteredC = ListCats.filter((product) => {
        return product.type._id === selectedCategory._id;
      });
      setFilteredCats(filteredC);
    } else {
      setFilteredCats(ListCats);
    }
  }, [selectedCategory, ListCats]);

  useEffect(() => {
    if (selectedCategory) {
      const filteredD = ListDogs.filter((product) => {
        return product.type._id === selectedCategory._id;
      });
      setFilteredDogs(filteredD);
    } else {
      setFilteredDogs(ListDogs);
    }
  }, [selectedCategory, ListDogs]);

  // Hàm điều hướng đến màn hình ClassifyScreen
  const goToClassifyScreen = useCallback((type, animals) => {
    navigation.navigate("ClassifyScreen", { type: type, animals: animals });
  }, [navigation]);

  const goToDetailScreen = useCallback((item) => {
    navigation.navigate("DetailScreen", { item: item });
  }, [navigation]);

  const ItemCategory = ({ category }) => {
    const isSelected = selectedCategory && selectedCategory._id === category._id;

    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => setSelectedCategory(category)}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            height: 65,
            borderRadius: 10,
            backgroundColor: isSelected ? "#0FA2FF" : "#FBEEC2",
            borderWidth: 1,
            borderColor: "#C47500",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
          }}
        >
          <Image source={{ uri: category.img }} style={styles.categoryImage} />
        </View>
        <Text style={styles.categoryName}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const ItemList = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => goToDetailScreen(item)}
        style={styles.itemDog}
      >
        <Image source={{ uri: item.img }} style={styles.itemImage} />
        {item.status === "New" && (
          <Text style={styles.itemStatus}>{item.status}</Text>
        )}
        <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.itemStyle}>
          Mã SP: {upperCaseItem(item._id.slice(-5))}
        </Text>
        <Text style={styles.price}>{numberUtils(item.price)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar hidden />
        <View style={{ width: screenWidth, height: 280 }}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.petShopText}>Pet Shop</Text>
          <SliderShow />
          <TouchableOpacity
            style={styles.textNew}
            onPress={() => navigation.navigate("NewProductScreen")}
          >
            <Text style={styles.textNewContent}>Xem hàng mới về ➭</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.categoryTitle}>Category</Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => <ItemCategory category={item} />}
            keyExtractor={(item) => item._id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>


        <View>
          <Text style={styles.animalsTitle}>Dogs</Text>
          <FlatList
            numColumns={2}
            scrollEnabled={false}
            data={filteredDogs.slice(0, 6)}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <ItemList item={item} />}
          />
          <TouchableOpacity
            onPress={() => goToClassifyScreen(selectedCategory ? selectedCategory._id : categories[0]._id, "dog")}
            style={styles.textXemthem}
          >
            <Text style={styles.textXemthemContent}>Xem thêm</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.animalsTitle}>Cats</Text>
          <FlatList
            numColumns={2}
            scrollEnabled={false}
            data={filteredCats.slice(0, 6)}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <ItemList item={item} />}
          />
          <TouchableOpacity
            onPress={() => goToClassifyScreen(selectedCategory ? selectedCategory._id : categories[0]._id, "cat")}
            style={styles.textXemthem}
          >
            <Text style={styles.textXemthemContent}>Xem thêm</Text> 
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.cart}
        onPress={() => navigation.navigate("CartScreen")}
      >
        <Image source={require("../Image/cart.png")} style={styles.cartIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF"
  },
  welcomeText: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "450",
  },
  petShopText: {
    color: "#000000",
    fontSize: 24,
    fontWeight: "600",
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
    width: "47%",
    borderRadius: 12,
    padding: 12,
    marginVertical: 5,
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
    resizeMode: "contain"
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
    // Thêm các thuộc tính để kiểm soát việc cắt chữ
    overflow: 'hidden',
    width: '100%',  // Đảm bảo chiếm toàn bộ chiều rộng của cha
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
    top: "4%",
    right: "7%",
    backgroundColor: "white",
    elevation: 10,
    padding: 10,
    borderRadius: 30,
  },
  cartIcon: {
    height: 30,
    width: 30,
  },
  textNew: {
    marginTop: 10,
  },
  textNewContent: {
    fontSize: 17,
    color: "black",
    fontWeight: "bold",
  },
  categoryTitle: {
    color: "#000000",
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  animalsTitle: {
    color: "#000000",
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textXemthem: {
    width: "100%",
    padding: 12,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  textXemthemContent: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "bold",
    textDecorationLine: "underline",
  }
});

export default HomeScreen;