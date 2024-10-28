import React, { useContext, useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { webSocketContext } from "./websocket/WebSocketContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { URL } from "./HomeScreen";

const Petcare2 = () => {
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const websocket = useContext(webSocketContext);
  const navigation = useNavigation();

  const services = [
    { key: "1", value: "Dịch vụ 1" },
    { key: "2", value: "Dịch vụ 2" },
  ];

  const handleSubmit = async () => {
    const email = await AsyncStorage.getItem("@UserLogin");
    if (
      service != "" &&
      name != "" &&
      email != null &&
      phone != "" &&
      message != ""
    ) {
      try {
        const {
          status,
          data: { response, type },
        } = await axios.post(URL+"/pet-care/add", {
          service,
          name,
          email,
          phone,
          message,
        });
        if (status == 200) {
          ToastAndroid.show(response, ToastAndroid.SHORT);
          if (type) {
            websocket.send(
              JSON.stringify({
                service,
                name,
                email,
                phone,
                message,
              })
            );
          }
        }
      } catch (error) {
        console.log(error);
      }

      setName("");
      setPhone("");
      setMessage("");
      setService("");
    } else {
      ToastAndroid.show("Data empty!", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../Image/back.png")}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Liên hệ với chúng tôi</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Tên của bạn"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại của bạn"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Nội dung địa chỉ"
        value={message}
        onChangeText={setMessage}
        multiline={true}
        numberOfLines={4}
      />
      <SelectList
        setSelected={(val) => setService(val)}
        data={services}
        save="value"
        search={false}
        placeholder="Chọn dịch vụ"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Đăng ký dịch vụ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1, // Cho phép tiêu đề chiếm không gian giữa
    textAlign: "center", // Căn giữa văn bản
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#0066cc",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Petcare2;