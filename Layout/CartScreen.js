import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { congItem, removeItem, truItem } from '../Redux/action';
import { URL } from './HomeScreen';

const CartScreen = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);

    useEffect(() => {
        calculateTotalPrice();
        calculateTotalQuantity();
    }, [cartItems]);

    const calculateTotalPrice = () => {
        const total = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.price);
            const quantity = parseInt(item.quantity, 10);
            return sum + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity);
        }, 0);
        setTotalPrice(total);
    };

    const calculateTotalQuantity = () => {
        const total = cartItems.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
        setTotalQuantity(total);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const TaoMaHoaDon = async () => {
        const url = `${URL}/hoadons`;
        const NewHoaDon = { ngayMua: date };

        try {
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(NewHoaDon),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                const data = await res.json();
                const id = data.id;
                navigation.navigate('Payment', { total: totalPrice, id_bill: id });
            } else {
                console.error('Failed to create invoice');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={{ width: 20, height: 20 }} source={require('../Image/back.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Giỏ hàng</Text>
            </View>

            {/* Danh sách sản phẩm trong giỏ hàng */}
            <ScrollView>
                {cartItems.length > 0 ? (
                    cartItems.map(item => (
                        <View key={item.id} style={styles.item}>
                            <Image source={{ uri: item.img }} style={styles.image} />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemText}>{item.name}</Text>
                                <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                                <View style={styles.actionContainer}>
                                    <TouchableOpacity onPress={() => dispatch(truItem(item))} style={styles.btn}>
                                        <Image source={require('../Image/subtract.png')} style={styles.icon} />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={styles.counterInput}
                                        value={item.quantity.toString()}
                                        keyboardType="numeric"
                                        onChangeText={(text) => {
                                            const newQuantity = Number(text) || 1;
                                            dispatch(congItem({ ...item, quantity: newQuantity }));
                                        }}
                                    />
                                    <TouchableOpacity onPress={() => dispatch(congItem(item))} style={styles.btn}>
                                        <Image source={require('../Image/add.png')} style={styles.icon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => dispatch(removeItem(item))}>
                                        <Text style={styles.removeItem}>Xóa</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyCartText}>Giỏ hàng của bạn đang trống!</Text>
                )}
            </ScrollView>

            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Tổng tiền: {formatPrice(totalPrice)}</Text>
                <Text style={styles.totalText}>Tổng số lượng: {totalQuantity}</Text>
                <TouchableOpacity style={styles.checkoutButton} onPress={TaoMaHoaDon}>
                    <Text style={styles.checkoutText}>Thanh toán</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    headerTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    item: {
        height: 160,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        gap: 20,
    },
    image: {
        width: 120,
        height: 120,
    },
    itemDetails: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemPrice: {
        color: 'red',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btn: {
        padding: 7,
        borderRadius: 4,
        borderWidth: 1,
    },
    icon: {
        width: 10,
        height: 10,
    },
    counterInput: {
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        textAlign: 'center',
    },
    removeItem: {
        textDecorationLine: 'underline',
        marginLeft: 5,
    },
    totalContainer: {
        marginTop: 20,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkoutButton: {
        borderRadius: 9,
        padding: 12,
        backgroundColor: 'green',
        alignItems: 'center',
        marginTop: 10,
    },
    checkoutText: {
        color: 'white',
    },
    emptyCartText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: 'gray',
    },
};

export default CartScreen;
