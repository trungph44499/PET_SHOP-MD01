import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getListClassify } from '../Layout/classify/function';
import { numberUtils, upperCaseFirstItem } from "./utils/stringUtils";

export default NewProductScreen = ({ navigation }) => {
  const [data, setData] = useState([]);

  // Hàm lấy dữ liệu cho tất cả danh mục: Dog, Cat, Phụ kiện
  async function getData() {
    const dogs = await getListClassify('dog');
    const cats = await getListClassify('cat');
    const accessories = await getListClassify('accessory');

    // Gộp tất cả các sản phẩm lại
    const allProducts = [...dogs, ...cats, ...accessories];

    // Lọc sản phẩm có status là "New"
    const newProducts = allProducts.filter(item => item.status === 'New');

    // Cập nhật dữ liệu
    setData(newProducts);
  }

  useEffect(() => {
    getData();
  }, []);

  function goToDetailScreen(item) {
    navigation.navigate("DetailScreen", { item: item });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require('../Image/back.png')}
          />
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
          Sản phẩm mới
        </Text>
        <TouchableOpacity
          style={{ width: 50 }}
          onPress={() => navigation.navigate('CartScreen')}
        >
          <Image
            style={{ width: 26, height: 26 }}
            source={require('../Image/cart.png')}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        numColumns={2}
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToDetailScreen(item)}
            style={styles.itemProduct}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  itemProduct: {
    backgroundColor: 'white',
    width: '45%',
    borderRadius: 12,
    padding: 12,
    margin: 10,
    gap: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 10,
  },
  itemImage: {
    width: '100%',
    height: 130,
    borderRadius: 12,
  },
  itemName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  itemStatus: {
    fontSize: 17,
    fontStyle: "italic",
    color: "green",
    fontWeight: "bold", // Làm cho chữ đậm hơn
    backgroundColor: "#e0f7e0", // Nền màu nhẹ
    borderRadius: 5, // Bo góc
    padding: 5, // Thêm khoảng cách bêntrong
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
    fontWeight: '300',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red',
  },
});