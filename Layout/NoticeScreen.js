import { FlatList, Image, StyleSheet, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { URL } from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoticeScreen = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const retrieveData = async () => {
    try {
      const UserData = await AsyncStorage.getItem('@UserLogin');
      if (UserData != null) {
        setUser(JSON.parse(UserData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  useEffect(() => {
    if (user.email) {
      getData();
    }
  }, [user]);

  const getData = async () => {
    const url = `${URL}/payments/filter?email=${user.email}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const sortedData = data.sort((a, b) => new Date(b.ngayMua) - new Date(a.ngayMua));
      setData(sortedData);
      setLoading(false);
    }
  };

  

  const renderItem = ({ item }) => {
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

  const onRefresh = () => {
    setRefreshing(true);
    getData().then(() => setRefreshing(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{ width: 20, height: 20 }} source={require('../Image/back.png')} />
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>THÔNG BÁO</Text>
      </View>

      {data.length === 0
        ? <View>
          <Text style={{ textAlign: 'center' }}>Hiện chưa có thông báo nào cho bạn</Text>
        </View>
        :
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={item => item._id}
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
