import { FlatList, Image, StyleSheet, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { URL } from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoticeScreen = ({ navigation, route }) => {
  const [data, setdata] = useState([]);
  const [dataCart, setdataCart] = useState([]);
  const [dataDogs, setdataDogs] = useState([]);
  const [dataCats, setdataCats] = useState([]);
  const [dataPhuKien, setdataPhuKien] = useState([]);
  const [user, setuser] = useState([]);
  const [loading, setloading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const retrieveData = async () => {
    try {
      const UserData = await AsyncStorage.getItem('User');
      if (UserData != null) {
        setuser(JSON.parse(UserData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  const getData = async () => {
    console.log(user);
    const url = `${URL}/hoadons`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const sortedData = data.sort((a, b) => new Date(b.ngayMua) - new Date(a.ngayMua));
      setdata(sortedData);
      setloading(false);
      console.log(data);
    }
  };

  const getDataCart = async () => {
    const url = `${URL}/carts`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setdataCart(data);
    }
  };

  const getDataDog = async () => {
    const url = `${URL}/dogs`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setdataDogs(data);
    }
  };

  const getDataCat = async () => {
    const url = `${URL}/cats`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setdataCats(data);
    }
  };

  const getDataPhuKien = async () => {
    const url = `${URL}/phukien`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setdataPhuKien(data);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataDog();
      getDataCat();
      getDataPhuKien();
      getData();
      getDataCart();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await retrieveData();
    await getDataDog();
    await getDataCat();
    await getDataPhuKien();
    await getData();
    await getDataCart();
    setRefreshing(false);
  };

  const formatPrice = (price) => {
    if (price !== undefined && price !== null) {
      return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } else {
      return "";
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayIndex = d.getDay();
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();

    return `${daysOfWeek[dayIndex]}, ${day}/${month}/${year}`;
  };


  const renderItem = ({ item }) => {

    const Cart = dataCart.filter(c => c.id_bill == item.id);

    sl = 0;
    for (const item of Cart) {
      sl += item.soLuongMua;
    }
    const id_pro = Cart[0]?.id_Product;
    const Dog = dataDogs.find(dg => dg.id == id_pro);

    const Cat = dataCats.find(ct => ct.id == id_pro);

    const PhuKien = dataPhuKien.find(pk => pk.id == id_pro);



    return (
      <View>
        <Text>{formatDate(item.ngayMua)}</Text>
        <View style={styles.item}>
          <Image source={{ uri: Dog?.img || Cat?.img || PhuKien?.img }} style={styles.image} />
          <View style={{ padding: 20, justifyContent: 'space-between', gap: 10}}>
            {item.status == 0 ? <Text style={{ color: 'green', fontSize: 16, fontWeight: 'bold' }}>Đặt hàng thành công</Text>
              : <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Đã hủy đơn hàng</Text>}
            <Text>{Dog?.name || Cat?.name || PhuKien?.name}
              {/* <Text style={{ color: 'gray' }}>{'\n'}{Dog?.id}
              </Text> */}
            </Text>
            <Text>Mua {sl} sản phẩm</Text>
            <Text>Tổng tiền : {formatPrice(item.total)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={{ width: 20, height: 20 }}
              source={require('../Image/back.png')} />
          </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>THÔNG BÁO</Text>
      </View>

      {data.filter(i => i.id_User == user.id).length == 0
        ? <View>
          <Text style={{ textAlign: 'center' }}>Hiện chưa có thông báo nào cho bạn</Text>
        </View>
        :
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data.filter(i => i.id_User == user.id)}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />}
    </View>
  );
};

export default NoticeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16
  },
  header: {
    width: "100%",
    paddingVertical: 20
  },
  image: {
    width: 120,
    height: 120,
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  item: {
    height: 160,
    flexDirection: 'row',
    alignItems: 'center', borderTopWidth: 1, width: '100%',
    gap: 5
  },
});
