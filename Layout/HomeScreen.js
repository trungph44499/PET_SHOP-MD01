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
} from "react-native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SliderShow from "./components/SliderShow";
import { numberUtils, upperCaseFirstItem } from './utils/stringUtils';

export const URL = "http://192.168.138.55";

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  // const [isAdmin, setIsAdmin] = useState(false);
  const [ListDogs, setListDogs] = useState([]);
  const [ListCats, setListCats] = useState([]);
  const [ListAccessory, setListAccessory] = useState([]);

  async function getListProduct() {
    try {
      const {
        data: { response },
        status,
      } = await axios.get(`${URL}/products`);
      if (status == 200) {
        setListCats(response.filter((item) => item.type == "cat"));
        setListDogs(response.filter((item) => item.type == "dog"));
        setListAccessory(response.filter((item) => item.type == "accessory"));
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getListProduct();
  }, []);

  function goToClassifyScreen(type) {
    navigation.navigate("ClassifyScreen", { type: type });
  }

  function goToDetailScreen(item) {
    navigation.navigate("DetailScreen", { item: item });
  }

  function ItemList(item) {
    return (
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
        <Text style={styles.itemStyle}>Mã SP: {upperCaseFirstItem(item._id.slice(-5))}</Text>
        <Text style={styles.price}>{numberUtils(item.price)}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ width: screenWidth, height: 320 }}>
          <View>
            <Text
              style={{
                color: "#F79515",
                fontSize: 23,
                marginTop: 30,
                fontWeight: "400",
              }}
            >
              Pet Shop
            </Text>
            <Text
              style={{
                color: "#F79515",
                fontSize: 23,
                fontWeight: "400",
                marginBottom: 10,
              }}
            >
              Mua gì cũng có !!
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
                textDecorationLine: "underline",
              }}
            >
              Xem hàng mới về ➭
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 10,
            marginLeft: 10,
          }}
        >
          Dogs
        </Text>

        <FlatList
          numColumns={2}
          scrollEnabled={false}
          data={ListDogs.filter((item, index) => index < 4)}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => ItemList(item)}
        />

        <TouchableOpacity
          onPress={() => goToClassifyScreen("dog")}
          style={styles.Xemthem}
        >
          <View />
          <Text
            style={{
              fontSize: 14,
              color: "green",
              fontWeight: "bold",
              textDecorationLine: "underline",
            }}
          >
            Xem thêm
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
          Cats
        </Text>

        <FlatList
          numColumns={2}
          extraData={4}
          scrollEnabled={false}
          data={ListCats.filter((item, index) => index < 4)}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => ItemList(item)}
        />
        <TouchableOpacity
          onPress={() => goToClassifyScreen("cat")}
          style={styles.Xemthem}
        >
          <View />
          <Text
            style={{
              fontSize: 14,
              color: "green",
              fontWeight: "bold",
              textDecorationLine: "underline",
            }}
          >
            Xem thêm
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 10,
            marginLeft: 10,
          }}
        >
          Phụ kiện
        </Text>

        <FlatList
          numColumns={2}
          scrollEnabled={false}
          data={ListAccessory.filter((item, index) => index < 4)}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => ItemList(item)}
        />

        <TouchableOpacity
          onPress={() => goToClassifyScreen("accessory")}
          style={styles.Xemthem}
        >
          <View />
          <Text
            style={{
              fontSize: 14,
              color: "green",
              fontWeight: "bold",
              textDecorationLine: "underline",
            }}
          >
            Xem thêm
          </Text>
        </TouchableOpacity>
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

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
  container: {
    height: "100%",
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 12,
  },
  image: {
    width: 180,
    height: 150,
    borderRadius: 10,
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
  itemStyle: {
    fontSize: 13,
    fontWeight: "300",
  },
  Xemthem: {
    width: "100%",
    padding: 12,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  price: {
    fontSize: 17,
    fontWeight: "600",
    color: "red",
  },
  cart: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 40, // Khoảng cách từ trên cùng
    right: 30, // Khoảng cách từ bên trái
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
  },
  adminAdd: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 40,
    bottom: 90,
  },
  newSP: {
    bottom: 0,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "blue",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: "center",
  },
});
