import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import UnderLine from '../components/UnderLine';
import { useSelector,useDispatch } from 'react-redux';
import { URL } from './HomeScreen';


const Payment2 = ({ navigation, route }) => {
    const { id_bill,total, user, soDienThoai, diaChi, ship, pay } = route.params;
    const [date, setdate] = useState(new Date());
    const [day, setday] = useState(new Date().getDay());
    const [month, setmonth] = useState(new Date().getMonth());
    const [card, setcard] = useState('');
    const [cardname, setcardname] = useState('');
    const [carddate, setcarddate] = useState('');
    const [cvv, setcvv] = useState('');
    const [err, seterr] = useState(false);
    const [modalTiepTuc, setmodalTiepTuc] = useState(false);

    const cartItems = useSelector(state => state.cart.items);

    const formatPrice = (price) => {
        // Sử dụng phương thức toLocaleString để định dạng giá theo định dạng tiền tệ của Việt Nam (VND)
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };


    // modal option
    const OptionModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalTiepTuc}>
                <View style={styles.cardCotainer}>
                    <View />
                    <View style={styles.cardModal}>
                        <Text style={styles.textBold}>
                            Xác nhận thanh toán ?
                        </Text>

                        <Pressable
                            style={styles.btn}
                            onPress={() => { AddProducToCart(0) }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Đồng ý</Text>
                        </Pressable>
                        <Text onPress={() => { AddProducToCart(1) }}
                            style={{ textDecorationLine: 'underline', fontWeight: 'bold', fontSize: 16 }}>Hủy bỏ</Text>
                    </View>
                </View>
            </Modal>
        )
    }


    const AddProducToCart = async (status) => {
        const url = `${URL}/carts`;

        for (const pro of cartItems) {
            const NewCart = {
                id_bill : id_bill,
                id_Product : pro.id,
                soLuongMua : pro.quantity,
                giaMua : pro.price
            };

            const res = await fetch(url,{
                method: "POST",
                body: JSON.stringify(NewCart),
                headers: {
                    "Content_Type" : "application/json"
                }
            });
            if(res.ok){
                const data = await res.json();
                finalBill(status);
            }
        }
    }

    const finalBill = async (status) => {
        const url = `${URL}/hoadons/${id_bill}`;
        const FinalBill = {
            id_User : user.id,
            diaChi : diaChi,
            soDienThoai : soDienThoai,
            ship : ship,
            pay : pay,
            total : total + (ship ? 15000 : 20000),
            status : status,
            ngayMua: date
        };

        const res = await fetch(url,{
            method : 'PUT',
            body: JSON.stringify(FinalBill),
            headers: {
                "Content-Type" : "application/json"
            }
        });

        if(res.ok){
            const data = await res.json();
            navigation.navigate('FinalBill',{id_bill : id_bill});
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={{ width: 20, height: 20 }}
                        source={require('../Image/back.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>THANH TOÁN</Text>
                <View />
            </View>

            <ScrollView>
                <View style={{ paddingHorizontal: 20, gap: 10 }}>
                    <UnderLine value={'Nhập thông tin thẻ'} color={'black'} />
                    <TextInput placeholder='XXXX XXXX XXXX XXXX' style={styles.input} keyboardType='numeric' onChangeText={(txt) => setcard(txt)} />
                    {err && card == '' ? <Text style={{ color: 'red' }}>Vui lòng nhập số thẻ</Text> : null}
                    <TextInput placeholder='Tên chủ thẻ' style={styles.input} onChangeText={(txt) => setcardname(txt)} />
                    {err && cardname == '' ? <Text style={{ color: 'red' }}>Vui lòng nhập tên chủ thẻ</Text> : null}
                    <TextInput placeholder='Ngày hết hạn (MM/YY)' style={styles.input} onChangeText={(txt) => setcarddate(txt)} />
                    {err && carddate == '' ? <Text style={{ color: 'red' }}>Vui lòng nhập ngày hết hạn</Text> : null}
                    <TextInput placeholder='CVV' style={styles.input} onChangeText={(txt) => setcvv(txt)} />
                    {err && cvv == '' ? <Text style={{ color: 'red' }}>Vui lòng nhập CVV</Text> : null}
                </View>

                <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 30 }}>
                    <UnderLine value={'Thông tin khách hàng'} color={'black'} />
                    <Text style={styles.textGray}>{user.fullname}</Text>
                    <Text style={styles.textGray}>{user.email}</Text>
                    <Text style={styles.textGray}>{diaChi}</Text>
                    <Text style={styles.textGray}>{soDienThoai}</Text>
                </View>

                <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 30 }}>
                    <UnderLine value={'Phương thức thanh toán'} color={'black'} />
                    {ship
                        ? <UnderLine value={'Giao hàng nhanh - 15.000đ'} color={'gray'} color2={'gray'}
                            value2={`Dự kiến giao hàng ${day + 3}-${day + 5}/${month + 1}`} />
                        : <UnderLine value={'Giao hàng COD - 20.000đ'} color={'gray'} color2={'gray'}
                            value2={`Dự kiến giao hàng ${day + 2}-${day + 4}/${month + 1}`} />}
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
                    <View style={{ gap: 5 }}>
                        <Text style={styles.textBold}>Tạm tính :</Text>
                        <Text style={styles.textBold}>Phí vận chuyển :</Text>
                        <Text style={styles.textBold}>Tổng tiền :</Text>
                    </View>
                    <View style={{ gap: 5 }}>
                        <Text style={styles.textBold}>{formatPrice(total)}</Text>
                        <Text style={styles.textBold}>{ship ? '15.000 đ' : '20.000 đ'}</Text>
                        <Text style={[styles.textBold, { color: 'green', fontSize: 17, fontWeight: 'bold' }]}>{formatPrice(total + (ship ? 15000 : 20000))}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => {
                    card && cardname && carddate && cvv
                        ? setmodalTiepTuc(true) : seterr(true)
                }}
                    style={{
                        borderRadius: 9, padding: 12, alignItems: 'center',
                        backgroundColor: card && carddate && cardname && cvv ? '#825640' : 'gray',
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Tiếp tục</Text>
                </TouchableOpacity>
            </View>

            <OptionModal />
        </View>
    )
}

export default Payment2

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
        backgroundColor: '#825640',
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