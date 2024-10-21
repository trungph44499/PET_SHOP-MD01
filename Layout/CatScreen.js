import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; // Thêm vào đầu file

const CatScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading
// Lấy thông tin giỏ hàng từ Redux
const cartItems = useSelector((state) => state.cart.items);

// Hàm này giúp bạn tìm số lượng sản phẩm trong giỏ hàng
const getQuantityInCart = (id) => {
  const itemInCart = cartItems.find((item) => item.id === id);
  return itemInCart ? itemInCart.quantity : 0; // Trả về số lượng hoặc 0 nếu không có
};
  const getListCart = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await axios.get(`${URL}/carts/getFromCart`);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu.");
      console.log(err);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    getListCart();
  }, []);

  const handleDelete = async (id, type) => {
    const url =
      type === "Dogs"
        ? `${URL}/dogs/${id}`
        : type === "Cats"
        ? `${URL}/cats/${id}`
        : type === "Phụ kiện"
        ? `${URL}/phukien/${id}`
        : `${URL}/default/${id}`;

    try {
      const response = await fetch(url, { method: "DELETE" });
      if (response.ok) {
        Alert.alert("Xóa sản phẩm thành công");
        setData((prevData) => prevData.filter((item) => item.id !== id));
      } else {
        Alert.alert("Xóa sản phẩm thất bại");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa sản phẩm");
    }
  };

  const handleEdit = (item) => {
    navigation.navigate("EditScreen", { product: item });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("DetailScreen", { item })}
      style={styles.item}
    >
      <Image source={{ uri: item.img }} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemType}>Mã SP: {item.type}</Text>
      <Text style={styles.price}>{item.price}</Text>
      {/* Chức năng cho admin (nếu cần) */}
      {/* {isAdmin && (
        <View style={styles.adminActions}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Text style={styles.editButton}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id, item.type)}>
            <Text style={styles.deleteButton}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../Image/back.png")}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CATS</Text>
        <TouchableOpacity
          style={{ width: 50 }}
          onPress={() => navigation.navigate("CartScreen")}
        >
          <Image
            style={{ width: 26, height: 26 }}
            source={require("../Image/cart.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Tất cả</Text>
        <Text style={styles.filterText}>Hàng mới về</Text>
        <Text style={styles.filterText}>Hàng Sale</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Hiển thị loading
      ) : data.length > 0 ? (
        <FlatList
          numColumns={2}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
        />
      ) : (
        <Text style={styles.noDataText}>Không có sản phẩm nào.</Text> // Thông báo không có sản phẩm
      )}
    </View>
  );
};

export default CatScreen;

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
  headerTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 30,
    marginHorizontal: 20,
  },
  filterText: {
    color: "red",
  },
  item: {
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
  itemType: {
    fontSize: 13,
    fontWeight: "300",
  },
  price: {
    fontSize: 17,
    fontWeight: "600",
    color: "red",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
});
