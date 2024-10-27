import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import UnderLine from '../components/UnderLine';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { URL } from './HomeScreen';


const Payment = ({ navigation, route }) => {
  const { total, id_bill } = route.params;
  const [user, setuser] = useState([]);
  const [day, setday] = useState(new Date().getDay());
  const [month, setmonth] = useState(new Date().getMonth());
  const [ship, setship] = useState(true);
  const [card, setcard] = useState(true);
  const [err, seterr] = useState(false);
  const [diaChi, setdiaChi] = useState('');
  const [soDienThoai, setsoDienThoai] = useState('');

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

  const DeleteBill = async () => {
    const url = `${URL}/hoadons/${id_bill}`;
    const res = await fetch(url,{
      method: 'DELETE'
    });
    const data = await res.json();
    if(res.ok){
      navigation.goBack();
      console.log('====================================');
      console.log("Đã xóa : "+data.id);
      console.log('====================================');
    }
  }

  useEffect(() => {
    retrieveData()
  }, [])

  const formatPrice = (price) => {
    // Sử dụng phương thức toLocaleString để định dạng giá theo định dạng tiền tệ của Việt Nam (VND)
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => DeleteBill()}>
          <Image style={{ width: 20, height: 20 }}
            source={require('../Image/back.png')} />
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>THANH TOÁN</Text>
        <View />
      </View>

      <ScrollView>
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          <UnderLine value={'Thông tin khách hàng'} color={'black'} />
          <TextInput placeholder='Nhập họ tên' style={styles.input} value={user.fullname} editable={false} />
          <TextInput placeholder='Nhập email' style={styles.input} value={user.email} editable={false} />
          <TextInput placeholder='Nhập địa chỉ' style={styles.input} onChangeText={(txt) => setdiaChi(txt)} />
          {err && diaChi == '' ? <Text style={{ color: 'red' }}>Vui lòng nhập địa chỉ</Text> : null}
          <TextInput placeholder='Nhập số điện thoại' style={styles.input} onChangeText={(txt) => setsoDienThoai(txt)} keyboardType='numeric' />
          {err && soDienThoai == '' ? <Text style={{ color: 'red' }}>Vui lòng nhập số điện thoại</Text> : null}
          {err && isNaN(soDienThoai) ? <Text style={{ color: 'red' }}>Số điện thoại chưa đúng</Text> : null}

          <View style={{marginTop: 10}}>
            <UnderLine value={'Phương thức thanh toán'} color={'black'} />

            <Pressable onPress={() => setship(!ship)}>
              <UnderLine value={'Giao hàng nhanh - 15.000đ'} color={'gray'} color2={ship ? 'green' : 'gray'}
                value2={`Dự kiến giao hàng ${day + 3}-${day + 5}/${month + 1}`} />
              {ship ? <Image style={styles.img}
                source={require('../Image/select.png')} /> : null}
            </Pressable>
            <Pressable onPress={() => setship(!ship)}>
              <UnderLine value={'Giao hàng COD - 20.000đ'} color={'gray'} color2={!ship ? 'green' : 'gray'}
                value2={`Dự kiến giao hàng ${day + 2}-${day + 4}/${month + 1}`} />
              {!ship ? <Image style={styles.img}
                source={require('../Image/select.png')} /> : null}
            </Pressable>
          </View>

          <View style={{marginTop: 10}}>
          <UnderLine value={'Hình thức thanh toán'} color={'black'} />
          <Pressable onPress={() => setcard(!card)}>
            <UnderLine value={'Thẻ VISA/MASTERCARD'} color={'gray'} color2={card ? 'green' : 'gray'} />
            {card ? <Image style={[styles.img, { top: 8 }]}
              source={require('../Image/select.png')} /> : null}
          </Pressable>
          <Pressable onPress={() => setcard(!card)}>
            <UnderLine value={'Thẻ ATM'} color={'gray'} color2={!card ? 'green' : 'gray'} />
            {!card ? <Image style={[styles.img, { top: 8 }]}
              source={require('../Image/select.png')} /> : null}
          </Pressable>
          </View>
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
          soDienThoai && diaChi ?
            navigation.navigate('Payment2', {
              id_bill: id_bill,
              user: user,
              total: total,
              ship: ship,
              diaChi: diaChi,
              soDienThoai: soDienThoai,
              pay : card
            })
            : seterr(true)
        }}
          style={{
            borderRadius: 9, padding: 12, alignItems: 'center', backgroundColor: soDienThoai && diaChi ? '#825640' : 'gray',
          }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Payment

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
    fontSize: 15,
    fontWeight: '400',
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'gray'
  },
  img: { width: 20, height: 20, position: 'absolute', right: 20, top: 20 }
})