import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import axios from 'axios';
import { URL } from '../HomeScreen';

const AddShippingAddress = ({ route, navigation }) => {
  const { emailUser, address, index } = route.params || {};
  const [fullName, setFullName] = useState(address?.fullName || "");
  // const [phoneNumber, setPhoneNumber] = useState(address?.phoneNumber || "");
  const [addressText, setAddressText] = useState(address?.address || "");
  const [city, setCity] = useState(address?.city || "");
  const [cities, setCities] = useState([]);
  const [user, setUser] = useState({});

  // Lấy danh sách thành phố từ API khi component được tải
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { status, data } = await axios.get(`${URL}/city`);
        // Kiểm tra nếu response có đúng cấu trúc
        if (status === 200) {
          setCities(
            data.map((city) => ({
              label: city.name,  // Giả sử các thành phố có trường 'name'
              value: city.name,
            }))
          );
        } else {
          console.error("Cấu trúc dữ liệu không hợp lệ:", data);
          Alert.alert("Lỗi", "Dữ liệu từ API không hợp lệ.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thành phố: ", error);
        Alert.alert("Lỗi", "Không thể lấy danh sách thành phố");
      }
    };

    fetchCities();
  }, []);

  const userData = async () => {
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

  useEffect(() =>{
    userData();
  },[]);

  const phone = String(user.sdt);

  const validateForm = () => {
    if (!fullName || !addressText || !city) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return false;
    }

    // const phoneRegex = /^[0-9]{10,11}$/;
    // if (!phoneRegex.test(phoneNumber)) {
    //   Alert.alert("Lỗi", "Số điện thoại không hợp lệ!");
    //   return false;
    // }

    if (addressText.length < 3) {
      Alert.alert("Lỗi", "Địa chỉ phải có ít nhất 3 ký tự.");
      return false;
    }

    // if (city.length < 3) {
    //   Alert.alert("Lỗi", "Tên thành phố phải có ít nhất 3 ký tự.");
    //   return false;
    // }

    return true;
  };

  const saveAddress = async () => {
    if (!validateForm()) return;

    const newAddress = { fullName, phone, address: addressText, city };

    try {
      let storedAddresses = await AsyncStorage.getItem(
        emailUser + "_shippingAddresses"
      );
      storedAddresses = storedAddresses ? JSON.parse(storedAddresses) : [];

      if (index !== undefined) {
        // Chỉnh sửa địa chỉ
        storedAddresses[index] = newAddress;
      } else {
        // Thêm địa chỉ mới
        storedAddresses.push(newAddress);
      }

      // Lưu lại địa chỉ mới vào AsyncStorage
      await AsyncStorage.setItem(
        emailUser + "_shippingAddresses",
        JSON.stringify(storedAddresses)
      );

      Alert.alert("Thành công", "Địa chỉ đã được lưu!");

      // Quay lại màn hình trước và gửi dữ liệu cập nhật (nếu cần)
      navigation.goBack(); // Trở lại màn hình trước
    } catch (error) {
      console.error("Lỗi khi lưu địa chỉ:", error);
      Alert.alert("Lỗi", "Không thể lưu địa chỉ");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image style={styles.icon} source={require("../../Image/left-back.png")} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {address ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        </Text>
      </View>

      <TextInput
        style={[styles.input, { fontSize: 15 }]}
        placeholder="Họ và tên"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={[styles.input, { color: 'black', fontSize: 15 }]}
        placeholder="Số điện thoại"
        value={phone}
        editable={false}
        // onChangeText={setPhoneNumber}
        // keyboardType="phone-pad"
      />
      <TextInput
        style={[styles.input, { fontSize: 15 }]}
        placeholder="Địa chỉ"
        value={addressText}
        onChangeText={setAddressText}
      />
      {/* Sử dụng RNPickerSelect cho thành phố */}
      <View style={styles.inputCity}>
        <RNPickerSelect
          onValueChange={(value) => setCity(value)}
          items={cities}
          value={city}
          placeholder={{ label: "Chọn thành phố", value: null }}
          style={{
            inputAndroid: {
              height: 60,
            },
            inputIOS: {
              height: 60,
            }
          }}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={saveAddress}>
        <Text style={styles.submitText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 30,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    left: 0,
    zIndex: 1,
  },
  icon: {
    width: 20,
    height: 20,
  },
  input: {
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputCity: {
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#3D5C99",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddShippingAddress;
