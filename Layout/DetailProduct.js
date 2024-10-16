import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Provider, useDispatch } from 'react-redux';
import { addItem } from '../Redux/action';
import store from '../Redux/store';

const DetailProduct = ({ navigation, route }) => {
  const { item } = route.params;
  const [count, setcount] = useState(0)
  const [TongTien, setTongTien] = useState(0)
  console.log(item);

  const dispatch = useDispatch();

  const handleTang = () => {
    setcount(count + 1);
  }

  const handleGiam = () => {
    count > 0 ? setcount(count - 1) : setcount(count);
  }

  const getTongTien = () => {
    const Tong = Number(Number(item.price) * count);
    setTongTien(Tong * 1000);
  }


  useEffect(() => {
    getTongTien()
  }, [count])


  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={{ width: 20, height: 20 }}
              source={require('../Image/back.png')} />
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
          <TouchableOpacity style={{ width: 50 }} onPress={() => navigation.navigate('CartScreen')}>
            <Image style={{ width: 26, height: 26 }}
              source={require('../Image/cart.png')} />
          </TouchableOpacity>
        </View>

        <Image source={{ uri: item.img }} style={{ width: '100%', height: 300 }} />

        <View style={{ gap: 16, paddingHorizontal: 40 }}>
          <View style={{ width: 180, padding: 8, borderRadius: 10, backgroundColor: '#825640', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>{item.type}</Text>
          </View>

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#EB4F26' }}>{item.price} </Text>

          <ScrollView style={{ height: 200, padding: 1 }}>
            <Text>Chi tiết sản phẩm
              {'\n'}_______________________________________________
            </Text>
            {item.origin && <Text style={styles.txt}>Xuất xứ: {item.origin}
              {'\n'}_______________________________________________
            </Text>}
            <Text style={styles.txt}>Số lượng: <Text style={{ color: 'green', fontWeight: "bold" }}>còn {item.quantity} sp</Text>
              {'\n'}_______________________________________________{'\n'}
            </Text>
            <Text >Mô tả: {item.description}
            </Text>
          </ScrollView>
        </View>

        <TouchableOpacity onPress={() => {
          dispatch(addItem(item))
          ToastAndroid.show('Đã thêm vào giỏ hàng', 0);
        }}
          style={{
            borderRadius: 9, padding: 12, marginHorizontal: 20, alignItems: 'center', backgroundColor: '#825640',
            position: 'relative', bottom: 40, width: '90%', marginTop: 50
          }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default DetailProduct

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 20
  },
  icon: {
    width: 10,
    height: 10
  },
  btn: {
    padding: 7,
    borderRadius: 4,
    borderWidth: 1,
  },
  txt: {
    marginTop: 10
  }
})