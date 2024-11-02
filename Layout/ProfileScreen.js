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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image
              style={styles.icon}
              source={require("../Image/back.png")}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>PROFILE</Text>
        </View>

        <View style={styles.infor}>
          <Image
            source={
              user.avatar ? { uri: user.avatar } : require("../Image/pesonal.png")
            }
            style={{ width: 60, height: 60, borderRadius: 30 }}
          />
          <View style={{marginLeft: 20}}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {user.fullname}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "thin" }}>
              {user.email}
            </Text>
          </View>
        </View>

        <View style={styles.option}>
          <Text style={styles.textGray}>
            Chung
            {"\n"}_________________________________________________
          </Text>
          <View style={styles.background}>
            <Animated.View style={{ transform: [{ scale }] }}>
              <TouchableOpacity
                style={styles.button}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => navigation.navigate("Petcare")}
              >
                <Image source={require('../Image/dog_care.png')} style={styles.starImage} />
                <Text style={styles.buttonText}>Pet care</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Text onPress={() => navigation.navigate("ManageUser")}>
            Chỉnh sửa thông tin
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("PassReset")}>
            <Text>
              Đổi mật khẩu
            </Text>
          </TouchableOpacity>

          <Text>Q & A</Text>
        </View>

        <View style={styles.option}>
          <Text style={styles.textGray}>
            Bảo mật và điều khoản
            {"\n"}_________________________________________________
          </Text>
          <Text>Điều khoản và điều kiện</Text>
          <Text>Chính sách quyền riêng tư</Text>
          <Text
            style={{ color: "red"}}
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
                    onPress: () => {
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
            Đăng xuất
          </Text>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
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
    resizeMode: 'contain',
  },
  background: {
    width: 200,
    height: 45,
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  button: {
    width: '100%',
    height: '100%',
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#fcd4db',
    borderRadius: 20,
    padding: 10,
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
    marginLeft: 10
  },
});