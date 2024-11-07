import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { URL } from "./HomeScreen";

const ProfileScreen = ({ navigation, route }) => {
  const [user, setUser] = useState({});

  const [scale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const retrieveData = async () => {
    try {
      const userData = await AsyncStorage.getItem("@UserLogin");

      const {
        status,
        data: { response },
      } = await axios.post(`${URL}/users/getUser`, {
        email: userData,
      });
      if (status == 200) {
        setUser(...response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      retrieveData();
    }, [])
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            // onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image style={styles.icon} source={require("../Image/search.png")} />
          </TouchableOpacity>
          <Text style={styles.headerText}>PROFILE</Text>
          <TouchableOpacity onPress={() => {
            Alert.alert(
              "Xác nhận đăng xuất",
              "Bạn có chắc chắn muốn đăng xuất không?",
              [
                {
                  text: "Hủy",
                  onPress: () => console.log("Hủy đăng xuất"),
                  style: "cancel",
                },
                {
                  text: "Đăng xuất",
                  onPress: async () => {
                    // Xóa thông tin người dùng trong AsyncStorage
                    await AsyncStorage.removeItem("@UserLogin");
                    await AsyncStorage.removeItem("User");
                    await AsyncStorage.removeItem("RememberMe");

                    navigation.navigate("LoginScreen");
                    ToastAndroid.show("Đã đăng xuất", ToastAndroid.SHORT);
                  },
                  style: "destructive",
                },
              ],
              { cancelable: false }
            );
          }}>
            <Image source={require("../Image/out.png")}
              style={{ width: 60, height: 60 , borderRadius:20}}

            />
          </TouchableOpacity>
        </View>

        <View style={styles.infor}>
          <Image
            source={
              user.avatar
                ? { uri: user.avatar }
                : require("../Image/pesonal.png")
            }
            style={{ width: 60, height: 60, borderRadius: 30 }}
          />
          <View style={{ marginLeft: 10 }}>

            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {user.fullname}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "thin" }}>
              {user.email}
            </Text>
          </View>
        </View>

        <View style={styles.option}>

          <TouchableOpacity style={{ width: 360, height: 70, padding: 15, borderTopLeftRadius: 20, borderTopEndRadius: 20, backgroundColor: '#F5F5F5' }}
            
            onPress={() => navigation.navigate("history-pay")}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>My orders </Text>
            <Text style={{ fontSize: 10, color: "#A9A9A9" }}>Already have 10 orders</Text>
            <Image source={require("../Image/backk.png")}
              style={{ width: 40, height: 40, position: 'absolute', top: 15, left: 300 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ width: 360, height: 70, padding: 15, backgroundColor: '#F5F5F5' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Shipping Addresses </Text>
            <Text style={{ fontSize: 10, color: "#A9A9A9" }}>03 Addresses </Text>
            <Image source={require("../Image/backk.png")}
              style={{ width: 40, height: 40, position: 'absolute', top: 15, left: 300 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ width: 360, height: 70, padding: 15, backgroundColor: '#F5F5F5' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Payment Method </Text>
            <Text style={{ fontSize: 10, color: "#A9A9A9" }}>You have 2 cards </Text>
            <Image source={require("../Image/backk.png")}
              style={{ width: 40, height: 40, position: 'absolute', top: 15, left: 300 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ width: 360, height: 70, padding: 15, backgroundColor: '#F5F5F5' }}
            onPress={() => navigation.navigate("Petcare")}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>My reviews </Text>
            <Text style={{ fontSize: 10, color: "#A9A9A9" }}>Reviews for 5 item </Text>
            <Image source={require("../Image/backk.png")}
              style={{ width: 40, height: 40, position: 'absolute', top: 15, left: 300 }}
            />
          </TouchableOpacity>



          


        </View>


        <TouchableOpacity style={{ width: 360, height: 70, padding: 15, borderBottomStartRadius: 20, borderBottomEndRadius: 20, backgroundColor: '#F5F5F5' }}
        onPress={() => navigation.navigate("Profilesetting")}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Setting</Text>
          <Text style={{ fontSize: 10, color: "#A9A9A9" }}>Notification, Password, FAQ, Contact</Text>
          <Image source={require("../Image/backk.png")}
            style={{ width: 40, height: 40, position: 'absolute', top: 15, left: 300 }}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  backButton: {
    position: "absolute",
    left: 0,
    zIndex: 1,

  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 60
  },
  icon: {
    width: 30,
    height: 30,

  },
  infor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 20
  },
  option: {
    gap: 18,
    marginTop: 5,
  },
  textGray: {
    color: "gray",
  },
  starImage: {
    width: 32,
    height: 32,
    marginLeft: 5,
    resizeMode: "contain",
  },
  background: {
    width: 200,
    height: 45,
    backgroundColor: "transparent",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  button: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fcd4db",
    borderRadius: 20,
    padding: 10,
  },
  buttonText: {
    fontSize: 14,
    color: "black",
    marginLeft: 10,
  },
});
