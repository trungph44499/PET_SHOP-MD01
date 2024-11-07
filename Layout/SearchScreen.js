import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ToastAndroid, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { URL } from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { numberUtils } from './utils/stringUtils';

const SearchScreen = ({ navigation }) => {
  const [txtSearch, setTxtSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [emailUser, setEmailUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [ListSearch, setListSearch] = useState([]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const userEmail = await AsyncStorage.getItem('@UserLogin');
      setEmailUser(userEmail);
      fetchSearchHistory(userEmail); // Fetch history on user email change
    };
    fetchUserEmail();
  }, []);

  const fetchSearchHistory = async (emailUser) => {
    if (emailUser) {
      try {
        const response = await axios.get(`${URL}/searchs/history`, { params: { emailUser } });
        setListSearch(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử tìm kiếm:", error);
      }
    }
  };

  useEffect(() => {
    const searchProducts = async () => {
      if (txtSearch) {
        setLoading(true);
        try {
          const response = await axios.get(`${URL}/searchs/`, {
            params: { txt: txtSearch, emailUser },
          });
          setProducts(response.data.response || []);
          await fetchSearchHistory(emailUser); // Fetch history after search
        } catch (error) {
          console.error("Lỗi:", error.response ? error.response.data : error.message);
          ToastAndroid.show('Không thể tìm kiếm sản phẩm!', ToastAndroid.SHORT);
        } finally {
          setLoading(false);
        }
      } else {
        setProducts([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [txtSearch, emailUser]);

  const handleSetTxtSearch = (txt) => {
    setTxtSearch(txt);
  };

  const deleteSearch = async (_id) => {
    try {
      await axios.delete(`${URL}/searchs/${_id}`);
      setListSearch(prev => prev.filter(item => item._id !== _id));
      await fetchSearchHistory(emailUser); // Fetch history after deletion
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử tìm kiếm:", error);
      ToastAndroid.show('Không thể xóa lịch sử tìm kiếm!', ToastAndroid.SHORT);
    }
  };

  const resetSearch = useCallback(() => {
    setTxtSearch('');
    setProducts([]);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={resetSearch}>
          <Image style={{ width: 20, height: 20 }} source={require('../Image/reset.png')} />
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>TÌM KIẾM</Text>
        <View style={{ width: 50 }}></View>
      </View>

      <View style={styles.search}>
        <TextInput
          onChangeText={handleSetTxtSearch}
          value={txtSearch}
          placeholder='Tìm kiếm'
          style={{ marginStart: 10, marginEnd: 10, flex: 1 }}
        />
        <TouchableOpacity onPress={resetSearch}>
          <Image source={require('../Image/search.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listSearch}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {txtSearch === "" ? (
              <View style={{ gap: 10 }}>
                <Text style={{ fontSize: 15 }}>Tìm kiếm gần đây</Text>
                <FlatList
                  scrollEnabled={false}
                  data={ListSearch}
                  keyExtractor={item => item._id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.searchHistory}>
                      <View style={{ flexDirection: 'row', gap: 20 }}>
                        <Image style={styles.icon} source={require('../Image/clock.png')} />
                        <Text onPress={() => handleSetTxtSearch(item.txt)}>{item.txt}</Text>
                      </View>
                      <TouchableOpacity onPress={() => deleteSearch(item._id)}>
                        <Image style={styles.icon} source={require('../Image/cancel.png')} />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            ) : (
              <View>
                {products.length === 0 ? (
                  <Text style={{ fontSize: 15 }}>Không tìm thấy</Text>
                ) : (
                  <View style={{ gap: 12 }}>
                    <Text style={{ fontSize: 15 }}>Kết quả tìm kiếm</Text>
                    <FlatList
                      scrollEnabled={false}
                      data={products}
                      keyExtractor={item => item._id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('DetailScreen', { item })} style={styles.itemDog}>
                          <Image source={{ uri: item.img }} style={styles.itemImage} />
                          <View style={{ flexDirection: 'column', marginLeft: 10, flex: 1 }}>
                            <Text
                              style={{ fontSize: 17, fontWeight: "600", flex: 1 }}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item.name}
                            </Text>
                            <Text style={{ fontSize: 16, color: 'red', flex: 1, fontWeight: "600" }}>{numberUtils(item.price)}</Text>
                            <Text style={{ fontSize: 16, fontWeight: "thin", flex: 1 }}>Còn {item.quantity} sp</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;

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
  search: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 10
  },
  searchHistory: {
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  icon: {
    width: 24,
    height: 24
  },
  listSearch: {
    gap: 12,
    flexGrow: 1,
  },
  itemDog: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    width: "95%",
    borderRadius: 12,
    padding: 20,
    margin: 10,
    gap: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 10,
    flexShrink: 1,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12
  },
});
