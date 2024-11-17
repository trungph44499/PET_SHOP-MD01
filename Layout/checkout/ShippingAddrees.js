import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ShippingAddress = ({ navigation }) => {
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [emailUser, setEmailUser] = useState("");
  const [refreshing, setRefreshing] = useState(false); // Trạng thái refreshing

  // Hàm fetch danh sách địa chỉ giao hàng từ AsyncStorage
  const fetchShippingAddresses = async () => {
    try {
      const userEmail = await AsyncStorage.getItem("@UserLogin");
      if (!userEmail) {
        Alert.alert("Lỗi", "Không tìm thấy email người dùng");
        return;
      }
      setEmailUser(userEmail);

      const storedShippingAddresses = await AsyncStorage.getItem(
        userEmail + "_shippingAddresses"
      );

      if (storedShippingAddresses) {
        setShippingAddresses(JSON.parse(storedShippingAddresses));
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ giao hàng:", error);
    }
  };

  // Hàm xóa địa chỉ giao hàng với xác nhận
  const confirmDelete = (index) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa địa chỉ này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", onPress: () => deleteShippingAddress(index) },
    ]);
  };

  const deleteShippingAddress = async (index) => {
    const updatedShippingAddresses = [...shippingAddresses];
    updatedShippingAddresses.splice(index, 1);

    try {
      await AsyncStorage.setItem(
        emailUser + "_shippingAddresses",
        JSON.stringify(updatedShippingAddresses)
      );
      setShippingAddresses(updatedShippingAddresses);
      await AsyncStorage.removeItem(emailUser + "ShippingSaved");
      Alert.alert("Thành công", "Địa chỉ giao hàng đã được xóa");
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ giao hàng:", error);
      Alert.alert("Lỗi", "Không thể xóa địa chỉ giao hàng");
    }
  };

  // Hàm chỉnh sửa địa chỉ giao hàng
  const editShippingAddress = (address, index) => {
    navigation.navigate("AddShippingAddrees", {
      emailUser,
      address,
      index,
    });
  };

  // Hàm handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true); // Bắt đầu refreshing
    await fetchShippingAddresses(); // Tải lại danh sách địa chỉ
    setRefreshing(false); // Kết thúc refreshing
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await fetchShippingAddresses();
    });
    return unsubscribe;
  }, [navigation]);

  const ItemShipping = ({ item, index }) => {
    const [checkRemember, setCheckRemember] = useState(false);

    useEffect(() => {
      (async function () {
        let shippingSavedIndex = await AsyncStorage.getItem(
          emailUser + "ShippingSaved"
        );
        if (shippingSavedIndex == index) {
          setCheckRemember(true);
        }
      })();
    }, []);

    return (
      <View style={{ marginBottom: 20 }}>
        <View style={styles.checkbox}>
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.setItem(
                emailUser + "ShippingSaved",
                index.toString()
              );
              await fetchShippingAddresses();
            }}
          >
            <Image
              style={{ width: 20, height: 20 }}
              source={
                checkRemember
                  ? require("../../Image/check-box.png")
                  : require("../../Image/square.png")
              }
            />
          </TouchableOpacity>
          <Text style={styles.checkboxText}>Sử dụng làm địa chỉ giao hàng</Text>
        </View>
        <TouchableOpacity
          onPress={() => editShippingAddress(item, index)}
          style={styles.item}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              borderColor: "#D3D3D3",
            }}
          >
            <Text
              style={{ flex: 1, fontSize: 20, fontWeight: "bold", padding: 15 }}
            >
              {item.fullName}
            </Text>
            <TouchableOpacity
              onPress={async () => confirmDelete(index)}
              style={{ padding: 15 }}
            >
              <Image
                style={styles.deleteIcon}
                source={require("../../Image/cancel.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={{ padding: 15 }}>
            <Text style={styles.bold}>Địa chỉ: {item.address} </Text>
            <Text style={styles.bold}>Thành phố: {item.city} </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (shippingAddresses.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image
              style={styles.icon}
              source={require("../../Image/back.png")}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Địa chỉ giao hàng</Text>
        </View>
        <Text style={styles.emptyStateText}>Chưa có địa chỉ giao hàng</Text>

        {/* Pull-to-refresh khi không có địa chỉ */}
        <FlatList
          data={[]}
          renderItem={() => null}
          keyExtractor={() => "empty"}
          onRefresh={handleRefresh} // Thêm sự kiện pull-to-refresh
          refreshing={refreshing} // Cập nhật trạng thái refreshing
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AddShippingAddrees", { emailUser })
          }
        >
          <Image
            style={styles.addIcon}
            source={require("../../Image/add.png")}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image style={styles.icon} source={require("../../Image/back.png")} />
        </TouchableOpacity>
        <Text style={styles.title}>Địa chỉ giao hàng</Text>
      </View>

      <FlatList
        data={shippingAddresses}
        renderItem={({ item, index }) => (
          <ItemShipping item={item} index={index} />
        )}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={handleRefresh} // Thêm sự kiện pull-to-refresh
        refreshing={refreshing} // Cập nhật trạng thái refreshing
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddShippingAddrees", { emailUser })}
      >
        <Image style={styles.addIcon} source={require("../../Image/add.png")} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    top: 0,
    backgroundColor: "#fff",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  checkbox: {
    flexDirection: "row",
    marginBottom: 20,
  },
  bold: {
    fontSize: 16,
    color: "#808080",
    fontWeight: "regular",
  },
  deleteIcon: {
    width: 25,
    height: 25,
    tintColor: "black",
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
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
  icon: {
    width: 20,
    height: 20,
  },
  item: {
    marginBottom: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
    elevation: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    width: 25,
    height: 25,
    tintColor: "black",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});

export default ShippingAddress;
