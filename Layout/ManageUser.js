import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { URL } from "./HomeScreen";
import * as ImagePicker from "expo-image-picker";
import { validateSDT, validateName } from "./utils/stringUtils";
import { Toast } from "./utils/toastUtil";

const ManageUser = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    avatar:
      "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    fullname: "",
    email: "",
    sdt: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const email = await AsyncStorage.getItem("@UserLogin");
        if (email) {
          const response = await axios.post(`${URL}/users/getUser`, { email });
          if (response.status === 200) {
            const user = response.data.response[0];
            const userData = {
              avatar: user.avatar || "",
              fullname: user.fullname,
              email: user.email,
              sdt: user.sdt || "",
            };

            setUserInfo(userData);
          }
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải thông tin người dùng.");
      }
    };

    getUserInfo();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const type = result.assets[0].mimeType;
      const name = result.assets[0].fileName;
      setSelectedImage({ uri, type, name });
    }
  };

  const handleSave = async () => {
    const { fullname, email, sdt } = userInfo;
    if (!fullname) {
      Alert.alert("Lỗi", "Tên không được để trống");
      return;
    }

    if (!sdt) {
      Alert.alert("Lỗi", "Số điện thoại không được để trống");
      return;
    }

    if (!email) {
      Alert.alert("Lỗi", "Email không được để trống");
      return;
    }

    if (validateName(fullname)) {
      Alert.alert("Lỗi", "Họ tên chưa đúng định dạng");
      return;
    }

    if (!validateSDT(sdt)) {
      Alert.alert("Lỗi", "Số điện thoại không đúng định dạng");
      return;
    }

    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn thay đổi thông tin?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: async () => {
          try {
            var urlAvatar = "";
            if (selectedImage) {
              let formData = new FormData();
              formData.append("email", email);
              formData.append("avatar", selectedImage);

              const { data } = await axios.post(`${URL}/upload`, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });
              urlAvatar = data.filePath;
            }

            const { data } = await axios.post(
              `${URL}/users/update`,
              {
                avatar: urlAvatar === "" ? userInfo.avatar : urlAvatar,
                fullname,
                email,
                sdt,
              },
              { timeout: 5000 }
            );
            if (data.type) {
              Toast("Cập nhật thông tin thành công");
              navigation.goBack();
              return;
              
            }
            Toast("Không thể cập nhật thông tin người dùng.");
          } catch (error) {
            console.log(error);
            Toast("Mạng không ổn định, vui lòng thử lại");
          }
        },
      },
    ]);
  };

  const clearFullname = () => {
    setUserInfo({ ...userInfo, fullname: "" });
  };

  const clearSdt = () => {
    setUserInfo({ ...userInfo, sdt: "" });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Image
                  style={styles.icon}
                  source={require("../Image/left-back.png")}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Chỉnh sửa thông tin</Text>
            </View>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={pickImage}>
                <Image
                  style={styles.image}
                  source={
                    selectedImage
                      ? { uri: selectedImage.uri }
                      : { uri: userInfo.avatar }
                  }
                />
              </TouchableOpacity>
              <Text style={styles.imageText}>Thông tin của bạn</Text>
            </View>
            <View style={styles.textInput}>
              <View style={styles.input}>
                <TextInput
                  style={styles.textInputField}
                  placeholder="Fullname"
                  value={userInfo.fullname}
                  onChangeText={(text) =>
                    setUserInfo({ ...userInfo, fullname: text })
                  }
                />
                {userInfo.fullname ? (
                  <TouchableOpacity onPress={clearFullname} style={styles.bgX}>
                    <Text style={styles.clearButton}>X</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              <View style={styles.input}>
                <TextInput
                  style={styles.textInputField}
                  placeholder="Số điện thoại"
                  value={userInfo.sdt}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setUserInfo({ ...userInfo, sdt: text })
                  }
                />
                {userInfo.sdt ? (
                  <TouchableOpacity onPress={clearSdt} style={styles.bgX}>
                    <Text style={styles.clearButton}>X</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>LƯU THÔNG TIN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ManageUser;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    top: 0,
    justifyContent: "space-between",
    alignContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 30,
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
  },
  imageContainer: {
    width: "100%",
    height: 230,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  imageText: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 20,
  },
  textInput: {
    gap: 15,
    top: 30,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textInputField: {
    flex: 1,
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#a97053",
    alignItems: "center",
    marginTop: 70,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  clearButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
  bgX: {},
});
