import {
  Alert,
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
import React, { useEffect, useState, useRef } from "react";
import SliderShow from "./components/SliderShow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


export const URL = "http://192.168.1.5";

// 10.24.33.19
// 192.168.1.29
const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  // const [isAdmin, setIsAdmin] = useState(false);
  const [ListDogs, setListDogs] = useState([]);
  const [ListCats, setListCats] = useState([]);

  async function getListAnimal() {
    try {
      const {
        data: { response },
        status,
      } = await axios.get(`${URL}/animals`);
      if (status == 200) {
        setListCats(response.filter((item) => item.type == "cat"));
        setListDogs(response.filter((item) => item.type == "dog"));
      }
    } catch (error) {
      console.log(error);
    }
  }

  // const [imageList, setimageList] = useState([]);
  // const [currentImage, setcurrentImage] = useState(0);

  // const getListDogs = async () => {
  //   await fetch(`${URL}/dogs`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setListDogs(data);
  //     })
  //     .catch(err => console.log(err));
  // };

  // const getListCats = async () => {
  //   await fetch(`${URL}/cats`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setListCats(data);
  //     })
  //     .catch(err => console.log(err));
  // };

  useEffect(() => {
    getListAnimal();
    // const data = [
    //  {
    //    image: <Image key={"0"} style={{width: screenWidth, height: 230,}} source={require('../Image/banner_pet01.png')} resizeMode='stretch'></Image>,
    //  },
    //  {
    //   image: <Image style={{width: screenWidth, height: 230,}} source={require('../Image/banner_pet01.png')} resizeMode='stretch'></Image>,
    // },
    // {
    //   image: <Image style={{width: screenWidth, height: 230,}} source={require('../Image/banner_pet01.png')} resizeMode='stretch'></Image>,
    // },
    // {
    //   image: <Image style={{width: screenWidth, height: 230,}} source={require('../Image/banner_pet01.png')} resizeMode='stretch'></Image>,
    // },
    // ];
    // setimageList(data);

    // getListDogs();
    // getListCats();
    // checkUserRole();

    // const unsubscribe = navigation.addListener("focus", () => {
    // getListDogs();
    // getListCats();
    // });
  }, []);

  // const handleScroll = (e) => {
  //   if(!e) {
  //     return;
  //   }
  //   const {nativeEvent} = e;
  //   if(nativeEvent && nativeEvent.contenOffset) {
  //     const currentOffset = nativeEvent.contenOffset.x;
  //     let imageIndex = 0;
  //     if(nativeEvent.contenOffset.x > 0 ) {
  //       imageIndex = Math.floor((nativeEvent.contenOffset.x + screenWidth / 2) / screenWidth);
  //     }
  //     setcurrentImage(imageIndex);
  //   }
  // }

  // const checkUserRole = async () => {
  //   try {
  //     const userInfo = await AsyncStorage.getItem('User');
  //     if (userInfo) {
  //       const { role } = JSON.parse(userInfo);
  //       if (role === 'admin') {
  //         setIsAdmin(true);
  //       }
  //     }
  //   } catch (error) {
  //     Alert.alert('Lỗi', 'Không thể tải vai trò người dùng.');
  //   }
  // };

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
          {/* <ScrollView
           horizontal
          //  pagingEnabled
           contentContainerStyle={{width: screenWidth * imageList.length, height:230}}
           onScroll={handleScroll}
           scrollEventThrottle={16}
           >
            {imageList.map((e, index) => 
            <View key={index.toString()}>
              {e.image} 
            </View>
          )}
          </ScrollView> */}
          {/* <Image style={{ width: '100%', height: 230, justifyContent: 'center' }} source={require('../Image/banner_1.jpg')} /> */}
          <TouchableOpacity
            onPress={() => navigation.navigate("DogsSceen", { data: ListDogs })}
            style={styles.newSP}
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
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DetailScreen", { item: item })
              }
              style={styles.itemDogs}
            >
              <Image source={{ uri: item.img }} style={styles.itemImage} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemStyle}>ID: {item.type}</Text>
              <Text style={styles.price}>{item.price} </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("DogsSceen", { data: ListDogs })}
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
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DetailProduct", { item: item })
              }
              style={styles.itemDogs}
            >
              <Image source={{ uri: item.img }} style={styles.itemImage} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemStyle}>Mã SP: {item.type}</Text>
              <Text style={styles.price}>{item.price} </Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("CatsSceen", { data: ListCats })}
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
          data={ListDogs.filter((item, index) => index < 4)}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DetailProduct", { item: item })
              }
              style={styles.itemDogs}
            >
              <Image source={{ uri: item.img }} style={styles.itemImage} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemStyle}>ID: {item.type}</Text>
              <Text style={styles.price}>{item.price} </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("DogsSceen", { data: ListDogs })}
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
        onPress={() => navigation.navigate("CatScreen")}
      >
        <Image
          source={require("../Image/cart.png")}
          style={{ height: 30, width: 30 }}
        />
      </TouchableOpacity>
      {/* {isAdmin && (
        <TouchableOpacity style={styles.adminAdd} onPress={() => navigation.navigate('AddScreen')}>
          <Image source={require('../Image/add.png')} style={{ height: 20, width: 20 }} />
        </TouchableOpacity>
      )} */}
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
  itemDogs: {
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
    width: 40,
    height: 40,
    padding: 26,
    backgroundColor: "white",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 40,
    bottom: 550,
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
