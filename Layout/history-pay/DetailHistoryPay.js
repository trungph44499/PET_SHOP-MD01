import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Image } from "react-native";
import UnderLine from '../../components/UnderLine';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { URL } from '../HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { numberUtils } from '../utils/stringUtils';

const DetailHistoryPay = ({ route }) => {
    const navigation = useNavigation();
    const { id_bill, item, e } = route.params;
    const [Bill, setBill] = useState([]);
    const [user, setuser] = useState([]);
    const [dataHistory, setDataHistory] = useState([]);
    const [orderStatus, setOrderStatus] = useState(item.status); // Trạng thái đơn hàng

    // Lấy thông tin đơn hàng
    const getBill = async () => {
        const url = `${URL}/hoadons?id=${id_bill}`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            setBill(data[0]);
            console.log(data[0]);
        }
    }

    // Lấy thông tin người dùng
    const retrieveData = async () => {
        try {
            const UserData = await AsyncStorage.getItem('User');
            if (UserData != null) {
                setuser(JSON.parse(UserData));
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Lấy lịch sử thanh toán
    async function getAllHistoryPay() {
        try {
            const email = await AsyncStorage.getItem("@UserLogin");
            const { status, data } = await axios.get(`${URL}/pay/filter`, {
                params: {
                    email: email,
                },
            });
            if (status == 200) {
                setDataHistory(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getBill();
        retrieveData();
        getAllHistoryPay();
    }, []);

    // Hàm hủy đơn hàng
    function rejectBuyProduct() {
        if (orderStatus === 'reject') {
            Alert.alert("Đơn hàng đã bị hủy", "Bạn không thể hủy đơn hàng này nữa.");
            return;
        }
        
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
                                if (type) await getAllHistoryPay();
                                Alert.alert("Hủy đơn hàng thành công!");
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

    const totalAmount = item.products.reduce((sum, product) => sum + product.price * product.quantity, 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.icon} source={require("../../Image/back.png")} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Chi tiết đơn hàng</Text>
            </View>
            <ScrollView>
                <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 30 }}>
                    <UnderLine value={'Thông tin khách hàng'} color={'black'} />
                    <Text style={styles.textGray}>{item.fullname}</Text>
                    <Text style={styles.textGray}>{item.email}</Text>
                    <Text style={styles.textGray}>{item.location}</Text>
                    <Text style={styles.textGray}>{item.number}</Text>
                </View>

                <View style={styles.section}>
                    <UnderLine value={"Phương thức vận chuyển"} color={"black"} />
                    <Pressable style={styles.paymentOption}>
                        <Text style={styles.textGray}>{item.ship}</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <UnderLine value={"Hình thức thanh toán"} color={"black"} />
                    <Pressable  style={styles.paymentOption}>
                    <Text style={styles.textGray}>{item.paymentMethod}</Text>
                    </Pressable>
                </View>

                <View style={{ paddingHorizontal: 20, gap: 10 }}>
                    <UnderLine value={'Đơn hàng đã chọn'} color={'black'} />
                    {item.products.map((e) => (
                        <View key={e.id} style={{ flexDirection: 'row' }}>
                            <Image source={{ uri: e.image }} style={styles.image} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.textGray}>{e.name}</Text>
                                <Text style={styles.textGray}>{numberUtils(e.price)}</Text>
                                <Text style={styles.textGray}>{e.quantity}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View style={{ width: '90%', marginVertical: 20, marginHorizontal: '5%', gap: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.textBold}>Đã thanh toán</Text>
                    <Text style={styles.textBold}>{numberUtils(totalAmount)}</Text>
                </View>
                {/* Button Hủy đơn hàng */}
                <TouchableOpacity 
                    onPress={rejectBuyProduct}
                    style={{
                        borderRadius: 9, 
                        padding: 12, 
                        alignItems: 'center',
                        backgroundColor: orderStatus === "reject" ? '#d3d3d3' : '#825640', // Thay đổi màu nút nếu đơn hàng đã bị hủy
                    }}>
                    <Text style={{ fontSize: 16, color: 'white' }}>
                        {orderStatus === "reject" ? 'Đơn hàng đã bị hủy' : 'Hủy đơn hàng'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default DetailHistoryPay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
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
    textGray: {
        fontSize: 16,
        color: 'black'
    },
    textBold: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    image: {
        width: 100,
        height: 100,
        marginHorizontal: 15,
    },
    section: {
        padding: 15,
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
});
