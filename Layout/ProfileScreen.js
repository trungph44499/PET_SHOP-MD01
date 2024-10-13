import { Image, ScrollView, StyleSheet, Text, ToastAndroid, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = ({navigation, route}) => {
  const [user, setUser] = useState({});

  const retrieveData = async () => {
    try {
      const userData = await AsyncStorage.getItem('User');
      if (userData != null) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      retrieveData();
    }, [])
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={{ width: 20, height: 20 }} source={require('../Image/back.png')} />
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>PROFILE</Text>
        </View>

        <View style={styles.infor}>
          <Image source={user.img ? { uri: user.img } : require('../Image/pesonal.png')} style={{ width: 60, height: 60, borderRadius: 30 }} />
          <Text style={{fontSize: 17, fontWeight: 'bold' }}>Fullname: {user.fullname}</Text>
          <Text style={{fontSize: 15, fontWeight: 'bold' }}>Email: {user.email}</Text>
          <Text style={{fontSize: 12, fontWeight: '500'}}>Role: {user.role}</Text>
        </View>

        <View style={styles.option}>
          <Text style={styles.textGray}>Chung 
          {'\n'}_________________________________________________</Text>
          <Text onPress={() => navigation.navigate('ManageUser')}>Chỉnh sửa thông tin</Text>
      
          <Text onPress={() => navigation.navigate('NoticeScreen')}>Lịch sử giao dịch</Text>
          <Text>Q & A</Text>
        </View>
        
        <View style={styles.option}>
          <Text style={styles.textGray}>Bảo mật và điều khoản 
          {'\n'}_________________________________________________</Text>
          <Text>Điều khoản và điều kiện</Text>
          <Text>Chính sách quyền riêng tư</Text>
          <Text style={{color: 'red'}} onPress={() => {navigation.navigate('LoginScreen'); ToastAndroid.show("Đã đăng xuất", ToastAndroid.SHORT)}}>Đăng xuất</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default ProfileScreen;

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
  infor:{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  option:{
    gap: 18,
    marginTop: 10
  },
  textGray:{
    color: 'gray'
  }
});
