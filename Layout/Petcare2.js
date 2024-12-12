import React, { useContext, useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { webSocketContext } from "./websocket/WebSocketContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { URL } from "./HomeScreen";
import { Alert } from "react-native";

const Petcare2 = () => {
  const [service, setService] = useState("");
  const [namePet, setNamePet] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // Thêm trạng thái tải
  const websocket = useContext(webSocketContext);
  const navigation = useNavigation();
  const checkShippingAddresses = JSON.stringify(shippingAddresses) === "{}";
  const [shippingAddresses, setShippingAddresses] = useState({});

  const services = [
    { key: "1", value: "Dịch vụ 1" },
    { key: "2", value: "Dịch vụ 2" },
  ];

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const userEmail = await AsyncStorage.getItem("@UserLogin");

        const storedShippingAddresses = await AsyncStorage.getItem(
          userEmail + "_shippingAddresses"
        );
        let shippingSavedIndex = await AsyncStorage.getItem(
          userEmail + "ShippingSaved"
        );

        if (storedShippingAddresses && shippingSavedIndex) {
          setShippingAddresses(
            JSON.parse(storedShippingAddresses)[shippingSavedIndex]
          );
        } else {
          setShippingAddresses({});
        }
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ giao hàng:", error);
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleSubmit = async () => {

    Alert.alert(
      "Xác nhận đăng ký",
      "Bạn có chắc chắn muốn đăng ký dịch vụ này không?",
      [
        {
          text: "Hủy",
          onPress: () => console.log("Hủy đăng ký"),
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            const email = await AsyncStorage.getItem("@UserLogin");

            if (service !== "" && namePet !== "") {
              setIsLoading(true);  // Hiển thị biểu tượng tải
              try {
                const { status, data: { response, type } } = await axios.post(URL + "/pet-care/add", {
                  service,
                  name: shippingAddresses.fullName,
                  email,
                  phone: shippingAddresses.phoneNumber,
                  namePet: namePet,
                  message: `${shippingAddresses.address}, ${shippingAddresses.city}`,
                });

                setIsLoading(false);  // Ẩn biểu tượng tải

                if (status === 200) {
                  ToastAndroid.show(response, ToastAndroid.SHORT);
                  if (type) {
                    websocket.send(
                      JSON.stringify({
                        email,
                        type: "pet-care",
                      })
                    );
                  }
                  navigation.goBack();
                }
              } catch (error) {
                setIsLoading(false);  // Ẩn biểu tượng tải
                console.error(error);
                ToastAndroid.show("Đã có lỗi xảy ra, vui lòng thử lại!", ToastAndroid.SHORT);  // Thông báo lỗi
              }

              // Xóa form sau khi gửi thành công
              setNamePet("");
              setService("");
            } else {
              ToastAndroid.show("Vui lòng điền đủ thông tin!", ToastAndroid.SHORT);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../Image/left-back.png")}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Liên hệ với chúng tôi</Text>
      </View>
      {checkShippingAddresses ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ShippingAddrees");
          }}
          style={{
            marginBottom: 10,
            marginHorizontal: 5,
            borderRadius: 5,
            backgroundColor: "#fff",
            elevation: 5,
            padding: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.bold}>Thêm địa chỉ nhận hàng</Text>
            <Image
              style={styles.deleteIcon}
              source={require("../Image/left.png")}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ShippingAddrees");
          }}
          style={{
            marginBottom: 10,
            marginHorizontal: 5,
            borderRadius: 5,
            backgroundColor: "#fff",
            elevation: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Image
                style={styles.deleteIcon}
                source={require("../Image/location.png")}
              />
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginHorizontal: 5,
                    }}
                  >
                    {shippingAddresses.fullName}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "300",
                      fontSize: 18,
                    }}
                  >
                    {shippingAddresses.phoneNumber}
                  </Text>
                </View>
                <View style={{ height: 5 }} />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.bold}>
                    Địa chỉ: {shippingAddresses.address},{" "}
                    {shippingAddresses.city}
                  </Text>
                </View>
              </View>
            </View>
            <Image
              style={styles.deleteIcon}
              source={require("../Image/left.png")}
            />
          </View>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        placeholder="Tên thú cưng"
        value={namePet}
        onChangeText={setNamePet}
      />

      <View style={{
        marginHorizontal: 5,
      }}>
        <SelectList
          setSelected={(val) => setService(val)}
          data={services}
          save="value"
          search={false}
          placeholder="Chọn dịch vụ"
          style={{ height: 50 }} // Đặt chiều cao cố định cho SelectList
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />  // Hiển thị biểu tượng tải
        ) : (
          <Text style={styles.buttonText}>Đăng ký dịch vụ</Text>
        )}
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
    marginHorizontal: 5,
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
    position: "absolute",
    bottom: 5,
    width: "100%",
    backgroundColor: "#0066cc",
    margin: 20,
    padding: 15,
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
  deleteIcon: {
    width: 20,
    height: 20,
    marginTop: 2,
  },
});

export default Petcare2;
