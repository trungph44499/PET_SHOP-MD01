import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { congItem, removeItem, truItem } from '../Redux/action';
import { URL } from './HomeScreen';

const CartScreen = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        calculateTotalPrice();
    }, [cartItems]);

    const calculateTotalPrice = () => {
        let total = 0;
        cartItems.forEach(item => {
            const price = parseFloat(item.price);
            const quantity = parseInt(item.quantity, 10);
            if (!isNaN(price) && !isNaN(quantity)) {
                total += price * quantity * 1000000; // Giả sử giá đã lưu theo triệu
            }
        });
        setTotalPrice(total);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const TaoMaHoaDon = async () => {
        const url = `${URL}/hoadons`;
        const NewHoaDon = { ngayMua: date };

        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(NewHoaDon),
            headers: { "Content-Type": "application/json" }
        });

        if (res.ok) {
            const data = await res.json();
            const id = data.id;
            navigation.navigate('Payment', { total: totalPrice, id_bill: id });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={{ width: 20, height: 20 }} source={require('../Image/back.png')} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Giỏ hàng</Text>
            </View>

            <ScrollView>
                {cartItems.map(item => (
                    <View key={item.id} style={styles.item}>
                        <Image source={{ uri: item.img }} style={styles.image} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemText}>{item.name}</Text>
                            <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity )}</Text>
                            <View style={styles.actionContainer}>
                                <TouchableOpacity onPress={() => dispatch(truItem(item))} style={styles.btn}>
                                    <Image source={require('../Image/subtract.png')} style={styles.icon} />
                                </TouchableOpacity>
                                <Text>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => dispatch(congItem(item))} style={styles.btn}>
                                    <Image source={require('../Image/add.png')} style={styles.icon} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => dispatch(removeItem(item))}>
                                    <Text style={styles.removeItem}>Xóa</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {cartItems.length > 0 ? (
                <View style={styles.checkoutSection}>
                    <View style={styles.totalPriceContainer}>
                        <Text style={{color:'red', fontStyle:'normal'}}>Tổng:</Text>
                        <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
                    </View>
                    <TouchableOpacity onPress={TaoMaHoaDon} style={styles.checkoutButton}>
                        <Text style={styles.checkoutText}>Tiến hành thanh toán</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')} style={styles.emptyCart}>
                    <Text style={styles.emptyCartText}>Giỏ hàng rỗng {'\n'}Thêm sản phẩm vào giỏ hàng</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20
    },
    headerTitle: {
        textAlign: 'center',
        flexDirection: 'center',
        justifyContent: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    item: {
        height: 160,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        gap: 20
    },
    image: {
        width: 120,
        height: 120
    },
    itemDetails: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between'
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    itemPrice: {
        color: 'red'
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    btn: {
        padding: 7,
        borderRadius: 4,
        borderWidth: 1
    },
    icon: {
        width: 10,
        height: 10
    },
    removeItem: {
        textDecorationLine: 'underline',
        marginLeft: 5
    },
    checkoutSection: {
        marginVertical: 20,
        gap: 20
    },
    totalPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        color:'#D9D9D9'
    },
    totalPrice: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    checkoutButton: {
        borderRadius: 9,
        padding: 12,
        backgroundColor: 'green',
        alignItems: 'center'
    },
    checkoutText: {
        color: 'white'
    },
    emptyCart: {
        position: 'absolute',
        top: '50%',
        width: '100%'
    },
    emptyCartText: {
        textAlign: 'center'
    }
};

export default CartScreen;
