
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { URL } from "./HomeScreen";

const ProfileScreen = ({ navigation, route }) => {
  const [user, setUser] = useState({});

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
    <ScrollView style={{backgroundColor: "#FFFFFF"}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image style={styles.icon} source={require("../Image/left-back.png")} />
          </TouchableOpacity>
          <Text style={styles.headerText}>HỒ SƠ CÁ NHÂN</Text>
          <TouchableOpacity style={styles.chat}   
          onPress={() =>
            navigation.navigate("ChatScreen")
          }
          >
            <Image source={require("../Image/messenger.png")}
              style={styles.icon}
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
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5,  letterSpacing: 2 }}>
              {user.fullname}
            </Text>
            <Text style={{ fontSize: 15, color: "#808080",  letterSpacing: 1  }}>
              {user.email}
            </Text>
          </View>
        </View>
        <View style={styles.option}>

          <TouchableOpacity style={styles.button}
            onPress={() => navigation.navigate("Petcare")}>
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Dịch vụ chăm sóc</Text>
             
            </View>
            <Image source={require("../Image/left.png")}
              style={{ width: 25, height: 25,  }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}
            onPress={() => navigation.navigate("history-pay")}>
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Lịch sử mua hàng</Text>
             
            </View>
            <Image source={require("../Image/left.png")}
              style={{ width: 25, height: 25,  }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}
            onPress={() => navigation.navigate("ShippingAddrees")}>
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Địa chỉ giao hàng</Text>
            
            </View>
            <Image source={require("../Image/left.png")}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.button}
            onPress={() => navigation.navigate("PaymentMethod")}>
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Phương thức thanh toán</Text>
       
            </View>
            <Image source={require("../Image/left.png")}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.button}
            onPress={() => navigation.navigate("ManageUser")}>
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Chỉnh sửa thông tin</Text>
             
            </View>
            <Image source={require("../Image/left.png")}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
            onPress={() => navigation.navigate("PassReset")}>
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Đổi mật khẩu</Text>
             
            </View>
            <Image source={require("../Image/left.png")}
              style={{ width: 25, height: 25,  }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
            
            onPress={() => {
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
            }}
            >
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </View>
            <Image source={require("../Image/left.png")}
              style={{ width: 25, height: 25,  }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 30,
    gap: 16,
    backgroundColor: "#FFFFFF"
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
  backOut: {
    position: "absolute",
    right: 0,
    zIndex: 1,
  },
  chat: {
    position: "absolute",
    right: 0,
    zIndex: 1,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    width: 20,
    height: 20,
  },
  infor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "center",
    width: "100%", height: 80,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,  // Làm tròn các góc
    elevation: 5,  // Tạo bóng đổ trên Android
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },
});
