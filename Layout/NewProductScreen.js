import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { URL } from './HomeScreen';
import { numberUtils, upperCaseItem } from "./utils/stringUtils";

export default NewProductScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu đã lọc và sắp xếp
  const [showNewOnly, setShowNewOnly] = useState(false); // Lọc theo sản phẩm mới hay không
  const [showPrice, setShowPrice] = useState(false); // Điều chỉnh thứ tự giá

  // Lấy dữ liệu sản phẩm từ API
  async function getData() {
    try {
      const { status, data: { response } } = await axios.get(`${URL}/products`);
      if (status === 200) {
        setData(response.filter(item => item.status === 'New'));
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }

  // Lọc và sắp xếp sản phẩm khi có sự thay đổi
  const filterAndSortData = () => {
    let updatedData = [...data];

    // Lọc sản phẩm theo loại (cat/dog) nếu có
    if (showNewOnly) {
      updatedData = updatedData.filter(item => item.animals === "cat");
    } else {
      updatedData = updatedData.filter(item => item.animals === "dog");
    }

    // Sắp xếp sản phẩm theo giá nếu có
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

  // Xử lý sự kiện khi nhấn nút "Dogs"
  const showAllDogs = () => {
    setShowNewOnly(false); // Chọn sản phẩm chó
  };

  // Xử lý sự kiện khi nhấn nút "Cats"
  const showAllCats = () => {
    setShowNewOnly(true); // Chọn sản phẩm mèo
  };

  // Xử lý sự kiện khi nhấn nút "Sắp xếp giá tăng"
  const showPriceUp = () => {
    setShowPrice(true); // Sắp xếp theo giá tăng
  };

  // Xử lý sự kiện khi nhấn nút "Sắp xếp giá giảm"
  const showPriceDown = () => {
    setShowPrice(false); // Sắp xếp theo giá giảm
  };

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    getData();
  }, []);

  // Lọc và sắp xếp lại khi có sự thay đổi về showNewOnly hoặc showPrice
  useEffect(() => {
    filterAndSortData();
  }, [data, showNewOnly, showPrice]);

  // Chuyển đến màn hình chi tiết sản phẩm
  const goToDetailScreen = (item) => {
    navigation.navigate("DetailScreen", { item: item });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{ width: 20, height: 20 }} source={require('../Image/left-back.png')} />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Sản phẩm mới</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
          <Image style={{ width: 26, height: 26 }} source={require('../Image/cart.png')} />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={showAllDogs} style={[styles.button, { backgroundColor: !showNewOnly ? "#73B5F7" : "transparent" }]}>
          <Text style={{ fontSize: 15, color: showNewOnly ? "#7D7B7B" : "#FFFFFF", fontWeight: "bold" }}>Dogs</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={showAllCats} style={[styles.button, { backgroundColor: showNewOnly ? "#73B5F7" : "transparent" }]}>
          <Text style={{ fontSize: 15, color: showNewOnly ? "#FFFFFF" : "#7D7B7B", fontWeight: "bold" }}>Cats</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={showPriceDown} style={[styles.button, { backgroundColor: !showPrice ? "#73B5F7" : "transparent" }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 15, color: showPrice ? "#7D7B7B" : "#FFFFFF", fontWeight: "bold" }}>Giá </Text>
            <Image style={{ width: 13, height: 13, tintColor: showPrice ? "#7D7B7B" : "#FFFFFF", }}
              source={require("../Image/item_down.png")} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={showPriceUp} style={[styles.button, { backgroundColor: showPrice ? "#73B5F7" : "transparent" }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 15, color: !showPrice ? "#7D7B7B" : "#FFFFFF", fontWeight: "bold" }}>Giá </Text>
            <Image style={{ width: 13, height: 13, tintColor: !showPrice ? "#7D7B7B" : "#FFFFFF", }}
              source={require("../Image/item_up.png")} />
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        numColumns={2}
        data={filteredData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => goToDetailScreen(item)} style={styles.itemProduct}>
            <Image source={{ uri: item.img }} style={styles.itemImage} />
            {item.status === "New" && <Text style={styles.itemStatus}>{item.status}</Text>}
            <View style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            </View>
            <Text style={styles.itemType}>Mã SP: {upperCaseItem(item._id.slice(-5))}</Text>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
              <Text style={styles.price}>{numberUtils(item.size[0].price)}</Text>
              <Text style={styles.daBan}>Đã bán: {item.sold}</Text>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    margin: 5
  },
  itemProduct: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
    padding: 10,
    margin: 6,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 5,
  },
  itemImage: {
    width: '100%',
    height: 130,
    borderRadius: 12,
    resizeMode: "contain",
  },
  itemName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
    overflow: 'hidden',
    width: '100%',
    marginBottom: 10
  },
  itemStatus: {
    position: "absolute",
    top: '58%',
    right: '8%',
    fontSize: 14,
    fontStyle: "italic",
    color: "#FFFFFF",
    fontWeight: "bold",
    backgroundColor: "#bcea82",
    borderRadius: 12,
    padding: 5,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  itemType: {
    fontSize: 10,
    fontWeight: '300',
    marginBottom: 5
  },
  price: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: 'red',
  },
  daBan: {
    fontSize: 10,
  },
});
