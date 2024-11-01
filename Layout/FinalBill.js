import { BackHandler, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import UnderLine from '../components/UnderLine';
import { URL } from './HomeScreen';
import { useSelector, useDispatch } from 'react-redux';
import { removeAllItem } from '../Redux/action';
import AsyncStorage from '@react-native-async-storage/async-storage'

const FinalBill = ({ navigation, route }) => {
    const { id_bill } = route.params;
    const [user, setuser] = useState([]);

    const [day, setday] = useState(new Date().getDay());
    const [month, setmonth] = useState(new Date().getMonth());
    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();
    const [Bill, setBill] = useState([]);

    const getBill = async () => {
        const url = `${URL}/hoadons?id=${id_bill}`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            setBill(data[0]);
            console.log(data[0]);
        }
    }

    // lấy user từ AsyncStorage
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

    useEffect(() => {
        getBill()
        retrieveData()
    }, [])

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Home'); // Thay 'Home' bằng tên màn hình HOME của bạn
            dispatch(removeAllItem());
            return true; // Ngăn chặn hành vi mặc định của nút back
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove(); // Loại bỏ trình nghe sự kiện khi component unmount

    }, [navigation]);

    const formatPrice = (price) => {
        if (price !== undefined && price !== null) {
            return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        } else {
            return ""; // Hoặc trả về một giá trị mặc định khác nếu cần
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View />
                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>THÔNG BÁO</Text>
                <View />
            </View>

            <ScrollView>
                {Bill.status == 0 ? <Text style={{ color: 'green', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Bạn đã đặt hàng thành công </Text>
                : <Text style={{ color: 'red', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Đơn hàng của bạn đã bị hủy bỏ </Text>}

                <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 30 }}>
                    <UnderLine value={'Thông tin khách hàng'} color={'black'} />
                    <Text style={styles.textGray}>{user.fullname}</Text>
                    <Text style={styles.textGray}>{user.email}</Text>
                    <Text style={styles.textGray}>{Bill.diaChi}</Text>
                    <Text style={styles.textGray}>{Bill.soDienThoai}</Text>
                </View>

                <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 30 }}>
                    <UnderLine value={'Phương thức vận chuyển'} color={'black'} />
                    {Bill.ship
                        ? <UnderLine value={'Giao hàng nhanh - 15.000đ'} color={'gray'} color2={'gray'}
                            value2={`Dự kiến giao hàng ${day + 3}-${day + 5}/${month + 1}`} />
                        : <UnderLine value={'Giao hàng COD - 20.000đ'} color={'gray'} color2={'gray'}
                            value2={`Dự kiến giao hàng ${day + 2}-${day + 4}/${month + 1}`} />}
                </View>

                <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 30 }}>
                    <UnderLine value={'Hình thức thanh toán'} color={'black'} />
                    {Bill.pay
                        ? <UnderLine value={'Thẻ VISA/MASTERCARD'} color={'gray'} color2={'gray'} />
                        : <UnderLine value={'Thẻ ATM'} color={'gray'} color2={'gray'} />}
                </View>

                <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 30 }}>
                    <UnderLine value={'Đơn hàng đã chọn'} color={'black'} />
                    {cartItems.map(item => (
                        <View key={item.id} style={styles.item}>
                            <Image source={{ uri: item.img }} style={styles.image} />
                            <View style={{ padding: 20, justifyContent: 'space-between', gap: 10 }}>
                                <Text style ={{fontSize: 15, fontWeight: 'bold'}}>{item.name}
                                <Text style={{ color: 'gray' }}>{'\n'}{item.id}</Text>
                                    {'\n'}{item.price}</Text>
                                <Text style ={{fontSize: 15, fontWeight: 'bold'}}>Số lượng mua : {item.quantity}</Text>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>
            <View style={{ width: '90%', marginVertical: 20, marginHorizontal: '5%', gap: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.textBold}>Đã thanh toán</Text>
                    <Text style={[styles.textBold, { color: 'green', fontSize: 17, fontWeight: 'bold' }]}>{formatPrice(Bill.total)}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Home'), dispatch(removeAllItem())
                }}
                    style={{
                        borderRadius: 9, padding: 12, alignItems: 'center',
                        backgroundColor: '#825640',
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Quay về trang chủ</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default FinalBill

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20
    },
    textBold: {
        fontSize: 14,
        fontWeight: '400',
    },
    textGray: {
        fontSize: 16,
        color: 'gray'
    },
    input: {
        width: '100%',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'gray'
    },
    img: { width: 20, height: 20, position: 'absolute', right: 20, top: 20 },
    cardCotainer: {
        height: "100%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    cardModal: {
        width: "90%",
        marginBottom: 40,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 50,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    btn: {
        padding: 14,
        borderRadius: 10,
        backgroundColor: 'green',
        marginVertical: 20,
        width: '100%',
        alignItems: "center"
    },
    image: {
        width: 120,
        height: 120,
    },
    item: {
        height: 160,
        flexDirection: 'row',
        alignItems: 'center', borderBottomWidth: 1, width: '100%',
        gap: 20
    },
})