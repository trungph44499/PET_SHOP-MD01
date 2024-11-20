  import React, { useEffect, useState } from "react";
  import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
    StatusBar,
  } from "react-native";
  import axios from "axios";
  import { URL } from "./HomeScreen";
  import { numberUtils, upperCaseItem } from "./utils/stringUtils";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import * as Font from 'expo-font';

  const DetailProduct = ({ navigation, route }) => {
    const { item } = route.params;
    var [count, setCount] = useState(1);
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
      // Tải font tùy chỉnh
      Font.loadAsync({
        'Roboto-Italic': require('../assets/fonts/Roboto-Italic.ttf'),
        'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),  // Đặt tên rõ ràng cho font
      }).then(() => setFontLoaded(true));
    }, []);

    const addProdct = () => {
      if (count < item.quantity) {
        setCount(count + 1);
      } else {
        ToastAndroid.show("Số lượng sản phẩm không đủ!", ToastAndroid.SHORT);
        return;
      }
    }
    const subtractProdct = () => {
      if (count > 1) {
        setCount(count - 1);
      } else {
        ToastAndroid.show("Số lượng sản phẩm không thể nhỏ hơn 1!", ToastAndroid.SHORT);
        return;
      }
    }

    const buyNow = () => {
      if (item.quantity < 1) {
        ToastAndroid.show("Số lượng sản phẩm không đủ!", ToastAndroid.SHORT);
        return;
      }
      navigation.navigate("Payment", {
        total: item.price * parseInt(count),
        listItem: [{
          id: item._id,
          image: item.img,
          name: item.name,
          type: item.type,
          price: item.price,
          quantity: parseInt(count),
        }],
      });
    };


    const addToCart = async () => {
      try {
        const emailUser = await AsyncStorage.getItem("@UserLogin");

        if (item.quantity < 1) {
          ToastAndroid.show("Số lượng sản phẩm không đủ!", ToastAndroid.SHORT);
          return;
        }

        const response = await axios.post(`${URL}/carts/addToCart`, {
          emailUser,
          _id: item._id,
          img: item.img,
          name: item.name,
          type: item.type,
          price: item.price,
          quantity: item.quantity,
        });

        if (response.status === 200) {
          ToastAndroid.show(response.data.response, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(
            response.data.response || "Có lỗi xảy ra!",
            ToastAndroid.SHORT
          );
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          ToastAndroid.show(
            error.response.data.response || "Có lỗi xảy ra!",
            ToastAndroid.SHORT
          );
        } else {
          ToastAndroid.show("Có lỗi xảy ra!", ToastAndroid.SHORT);
        }
      }
    };

    return (
      <View style={styles.container}>
        <ScrollView>
          <StatusBar hidden />
          <Image source={{ uri: item.img }} style={styles.productImage} />

          <View style={styles.detailsContainer}>
            <View style={styles.itemPrice}>
              <Text style={[styles.title, { fontFamily: 'Roboto-Bold' }]}>
                {item.name}
                </Text>
              <View style={styles.buttonPrice}>
                <Text style={styles.priceText}>{numberUtils(item.price)}</Text>
              </View>
            </View>
            <View style={styles.itemPrice}>
              <View style={{ flexDirection: "row", flex: 1, }}>
                <Image style={styles.starIcon} source={require("../Image/star.png")} />
                <Image style={styles.starIcon} source={require("../Image/star.png")} />
                <Image style={styles.starIcon} source={require("../Image/star.png")} />
                <Image style={styles.starIcon} source={require("../Image/star.png")} />
                <Image style={styles.starIcon} source={require("../Image/star.png")} />
                <Text style={{ marginLeft: 4 }}>(4.9)</Text>
              </View>
              <View style={styles.buttonAddCart}>
                <TouchableOpacity
                  onPress={addProdct}
                  style={styles.btn}>
                  <Image
                    source={require("../Image/add.png")}
                    style={styles.icon} />
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 10 }}>{count}</Text>
                <TouchableOpacity
                onPress={subtractProdct}
                  style={styles.btn}>
                  <Image
                    source={require("../Image/subtract.png")}
                    style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={styles.itemRow}>
                <View style={styles.itemRowRow}>
                  <View style={styles.itemBackgroud}>
                    <Image
                      source={require("../Image/calendar.png")}
                      style={{ height: 30, width: 30 }}
                    />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.textItem}>Age</Text>
                    <Text style={styles.textItemItem}>{item.origin}</Text>
                  </View>
                </View>
                <View style={styles.itemRowRow}>
                  <View style={styles.itemBackgroud}>
                    <Image
                      source={require("../Image/bone.png")}
                      style={{ height: 30, width: 30 }}
                    />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.textItem}>Quantity</Text>
                    <Text style={styles.textItemItem}>{item.quantity}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.itemRow}>
                <View style={styles.itemRowRow}>
                  <View style={styles.itemBackgroud}>
                    <Image
                      source={require("../Image/sex.png")}
                      style={{ height: 30, width: 30 }}
                    />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.textItem}>Sex</Text>
                    <Text style={styles.textItemItem}>{item.sex}</Text>
                  </View>
                </View>
                <View style={styles.itemRowRow}>
                  <View style={styles.itemBackgroud}>
                    <Image
                      source={require("../Image/weight.png")}
                      style={{ height: 30, width: 30 }}
                    />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.textItem}>Weight</Text>
                    <Text style={styles.textItemItem}>{item.weight}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ marginTop: 10, marginBottom: 40 }}>
              <Text style={styles.textDescription}>Description</Text>
              <Text style={styles.textDescriptionConten}>{item.description}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={{ position: "absolute", top: "2%", left: "5%" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={styles.iconBack} source={require("../Image/left-back.png")} />
          </TouchableOpacity>
        </View>
        <View style={{ position: "absolute", top: "2%", right: "5%" }}>
          <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
            <Image style={styles.cartIcon} source={require("../Image/cart_shopping.png")} />
          </TouchableOpacity>
        </View>
        <View style={styles.rowCart}>

          <TouchableOpacity onPress={addToCart} style={styles.addToCartButton}>
            <Image style={styles.cartButton} source={require("../Image/cart_01.png")} />
          </TouchableOpacity>

          <TouchableOpacity onPress={buyNow} style={styles.addMuaNgayButton}>
            <Text style={styles.addToCartText}>Mua ngay</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  };

  export default DetailProduct;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F5",
    },
    iconBack: {
      width: 26,
      height: 26,
    },
    cartIcon: {
      width: 26,
      height: 26,
    },
    starIcon: {
      width: 20,
      height: 20,
    },
    title: {
      flex: 1,
      fontSize: 24,
    
    },
    productImage: {
      width: "100%",
      height: 330,
      resizeMode: "cover",
    },
    detailsContainer: {
      padding: 20,
      backgroundColor: "#EFEFEF",
      marginBottom: 20,
    },
    productId: {
      backgroundColor: "#a97053",
      borderRadius: 8,
      padding: 8,
      alignSelf: "flex-start",
    },
    productIdText: {
      color: "#FFF",
      fontSize: 14,
      fontWeight: "bold",
    },
    priceText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "black",
      letterSpacing: 1
    },
    textDescription: {
      fontSize: 20,
      color: "black",
      fontWeight: "600",
    },
    textDescriptionConten: {
      fontSize: 15,
      color: "black",
      fontWeight: "500",
    },
    addToCartText: {
      color: "#FFF",
      fontSize: 17,
      fontWeight: "bold",
    },
    rowCart: {
      position: 'absolute',
      flexDirection: "row",
      bottom: 0,
      backgroundColor: "#FFFFFF"
    },
    cartButton: {
      width: 30,
      height: 30,
      color: "white"
    },
    addToCartButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#54A798",
      height: 50,
    },
    addMuaNgayButton: {
      flex: 2,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#DD5939",
      height: 50,
    },
    itemRow: {
      flexDirection: "row",
      marginVertical: 5
    },
    itemRowRow: {
      flex: 1,
      alignItems: 'center',
      flexDirection: "row",
      backgroundColor: "#FFFFFF",
      padding: 10, borderRadius: 10,
      marginHorizontal: 5,
      elevation: 2
    },
    itemBackgroud: {
      padding: 10, backgroundColor: '#FBEEC2',
      borderRadius: 10
    },
    textItem: {
      fontSize: 15,
      color: 'gray',
      fontWeight: '600'
    },
    textItemItem: {
      fontSize: 15,
      color: 'black',
      fontWeight: 'bold'
    },
    itemPrice: {
      flexDirection: "row",
      alignItems: "center"
    },
    buttonPrice: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      backgroundColor: "#CDDCEA",
      borderRadius: 20
    },
    buttonAddCart: {
      padding: 10,
      flexDirection: "row",
      alignItems: "center"
    },
    btn: {
      padding: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "black"
    },
    icon: {
      width: 10,
      height: 10,
    },
  });