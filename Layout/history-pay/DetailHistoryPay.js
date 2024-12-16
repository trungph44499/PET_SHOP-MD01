import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Image } from "react-native";
import UnderLine from '../../components/UnderLine';
import axios from 'axios';
import { URL } from '../HomeScreen';
import { numberUtils } from "../utils/stringUtils";

const DetailHistoryPay = ({ route }) => {
    const navigation = useNavigation();
    const { item } = route.params;
    const [orderStatus, setOrderStatus] = useState(item.status); // Trạng thái đơn hàng

    // Hàm hủy đơn hàng
    function rejectBuyProduct() {
        Alert.alert(
            "Xác nhận hủy đơn hàng",
            "Bạn có chắc chắn muốn hủy đơn hàng không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xác nhận",
                    onPress: async () => {
                        try {
                            const {
                                status,
                                data: { response, type },
                            } = await axios.post(`${URL}/pay/update`, {
                                id: item._id,
                                email: item.email,
                                products: item.products,
                                status: "reject",
                            });

                            if (status === 200) {
                                setOrderStatus("reject"); // Cập nhật trạng thái tại frontend
                                if (type)                               
                                Alert.alert("Hủy đơn hàng thành công!");
                                navigation.goBack();
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    },
                    style: "destructive",
                },
            ],
            { cancelable: false }
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.icon} source={require("../../Image/left-back.png")} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Chi tiết đơn hàng</Text>
            </View>
            <ScrollView>
                <View style={{ paddingHorizontal: 10, gap: 10, marginTop: 30 }}>
                    <UnderLine value={'Thông tin khách hàng'} color={'black'} />
                    <Text style={styles.textGray}>{item.fullname}</Text>
                    <Text style={styles.textGray}>{item.email}</Text>
                    <Text style={styles.textGray}>{item.location}</Text>
                    <Text style={styles.textGray}>{item.number}</Text>
                </View>

                <View style={styles.section}>
                    <UnderLine value={"Phương thức vận chuyển"} color={"black"} />
                    <Pressable style={styles.paymentOption}>
                        <Text style={styles.textGreen}>{item.ship}</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <UnderLine value={"Hình thức thanh toán"} color={"black"} />
                    <Pressable style={styles.paymentOption}>
                        <Text style={styles.textGreen}>{item.paymentMethod}</Text>
                    </Pressable>
                </View>

                <View style={{ paddingHorizontal: 20, gap: 10 }}>
                    <UnderLine value={'Đơn hàng đã chọn'} color={'black'} />
                    {item.products.map((item) => (
                        <View key={item.id} style={{ flexDirection: 'row' }}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text style={styles.textItem} numberOfLines={1} ellipsizeMode="tail">
                                    Tên sản phẩm: {item.name}
                                </Text>
                                <Text style={styles.textItem}>
                                    Giá tiền: {numberUtils(item.price)}
                                </Text>
                                <Text style={styles.textItem}>
                                    Kích thước: {item.size}
                                </Text>
                                <Text style={styles.textItem}>
                                    Số lượng: {item.quantity}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View style={{ width: '90%', marginVertical: 20, marginHorizontal: '5%', gap: 10, }}>
                <View style={styles.buttonPayMent}>
                    <Text style={styles.textPay}>Tổng tiền</Text>
                    <Text style={styles.textPay}>{numberUtils(item.totalPrice)}</Text>
                </View>
                {/* Nút Hủy đơn hàng chỉ xuất hiện khi orderStatus là "pending" */}
                {orderStatus === "pending" && (
                    <TouchableOpacity
                        onPress={rejectBuyProduct}
                        style={{
                            borderRadius: 9,
                            padding: 12,
                            alignItems: 'center',
                            backgroundColor: orderStatus === "reject" ? '#d3d3d3' : '#a97053', // Thay đổi màu nút nếu đơn hàng đã bị hủy
                        }}>
                        <Text style={{ fontSize: 16, color: 'white', fontWeight: "bold" }}>
                            {orderStatus === "reject" ? 'Đơn hàng đã bị hủy' : 'Hủy đơn hàng'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

export default DetailHistoryPay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "#FFFFFF"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    icon: {
        width: 20,
        height: 20,
    },
    headerText: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    textPay: {
        fontSize: 18,
        color: '#d9534f',
        fontWeight: "bold"
    },
    textGray: {
        fontSize: 16,
        color: 'black',
    },
    textGreen: {
        fontSize: 16,
        color: 'green'
    },
    textItem: {
        fontSize: 16,
        color: "#000",
        fontWeight: "bold",
        overflow: 'hidden',
        width: '100%',
    },
    textBold: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    image: {
        width: 110,
        height: 110,
        marginRight: 15,
        resizeMode: "contain"
    },
    section: {
        padding: 10,
    },
    paymentOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomColor: "#eaeaea",
        borderBottomWidth: 1,
        width: "100%",
    },
    buttonPayMent: {
        flexDirection: 'row', justifyContent: 'space-between', borderColor: "#EC6D42",
        borderWidth: 2,
        borderRadius: 10,
        padding: 10
    }
});
