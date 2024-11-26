import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { getListClassify } from '../Layout/classify/function';
import { numberUtils, upperCaseItem } from "./utils/stringUtils";
import axios from 'axios';
import { URL } from './HomeScreen';

export default NewProductScreen = ({ navigation }) => {
  const [data, setData] = useState([]);

  async function getData() {
    try {
      const { status, data: { response } } = await axios.get(`${URL}/products`);
      if (status === 200) {
        const newProducts = response.filter(item => item.status === 'New');
        setData(newProducts); // Lưu tất cả sản phẩm vào state
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
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
            source={require('../Image/left-back.png')}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
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
    elevation: 5,
  },
  itemImage: {
    width: '100%',
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
    fontWeight: '300',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red',
  },
});