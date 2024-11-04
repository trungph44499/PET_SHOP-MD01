
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ToastAndroid, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { URL } from './HomeScreen'; // Đảm bảo URL đã được định nghĩa
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = ({ navigation }) => {
  const [txtSearch, setTxtSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [emailUser, setEmailUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [ListSearch, setListSearch] = useState([]); // Lịch sử tìm kiếm

  useEffect(() => {
    const fetchUserEmail = async () => {
      const userEmail = await AsyncStorage.getItem('@UserLogin');
      setEmailUser(userEmail);
    };

    const fetchSearchHistory = async () => {
      if (emailUser) {
        try {
          const response = await axios.get(`${URL}/searchs/history`, { params: { emailUser } });
          setListSearch(response.data || []);
        } catch (error) {
          console.error("Lỗi khi lấy lịch sử tìm kiếm:", error);
        }
      }
    };

    fetchUserEmail();
    fetchSearchHistory();
  }, [emailUser]);

  useEffect(() => {
    const searchProducts = async () => {
      if (txtSearch) {
        setLoading(true);
        try {
          const response = await axios.get(`${URL}/searchs/`, {
            params: { txt: txtSearch, emailUser },
          });
          setProducts(response.data.response || []);
        } catch (error) {
          console.error("Lỗi:", error.response ? error.response.data : error.message);
          ToastAndroid.show('Không thể tìm kiếm sản phẩm!', ToastAndroid.SHORT);
        } finally {
          setLoading(false);
        }
      } else {
        setProducts([]); // Clear products when search text is empty
      }
    };

    const delayDebounceFn = setTimeout(() => {
      searchProducts();
    }, 300); // Thời gian trễ để tránh gửi yêu cầu quá nhiều

    return () => clearTimeout(delayDebounceFn);
  }, [txtSearch]);

  const handleSetTxtSearch = (txt) => {
    setTxtSearch(txt);
  };

  const deleteSearch = async (_id) => {
    try {
      await axios.delete(`${URL}/searchs/${_id}`);
      setListSearch(prev => prev.filter(item => item._id !== _id));
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
        <Text style={styles.title}>TÌM KIẾM</Text>
        <View style={{ width: 20 }}></View>
      </View>

      <View style={styles.search}>
        <TextInput
          onChangeText={handleSetTxtSearch}
          value={txtSearch}
          placeholder="Tìm kiếm"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={resetSearch}>
          <Image source={require('../Image/search.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listSearch}>
        {loading ? (
          <ActivityIndicator size="large" color="#A05E56" />
        ) : (
          <>
            {txtSearch === "" ? (
              <View style={{ gap: 10 }}>
                <Text style={styles.recentSearchTitle}>Tìm kiếm gần đây</Text>
                <FlatList
                  scrollEnabled={false}
                  data={ListSearch}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.searchHistory}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image style={styles.icon} source={require('../Image/clock.png')} />
                        <Text style={styles.historyText} onPress={() => handleSetTxtSearch(item.txt)}>
                          {item.txt}
                        </Text>
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
                  <Text style={styles.noResultText}>Không tìm thấy</Text>
                ) : (
                  <View style={{ gap: 12 }}>
                    <Text style={styles.resultTitle}>Kết quả tìm kiếm</Text>
                    <FlatList
                      scrollEnabled={false}
                      data={products}
                      keyExtractor={(item) => item._id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('DetailScreen', { item })} style={styles.itemDog}>
                          <Image source={{ uri: item.img }} style={styles.itemImage} />
                          <View style={{ gap: 5 }}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productPrice}>{item.price} đ</Text>
                            <Text style={styles.productQuantity}>Còn {item.quantity} sp</Text>
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
    backgroundColor: '#F8F8F8',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  search: {
    width: '100%',
    borderRadius: 25,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Giảm độ cao bóng trên Android để cân đối
  },
  searchInput: {
    flex: 1,
    marginStart: 10,
    marginEnd: 10,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#A05E56',
  },
  listSearch: {
    flexGrow: 1,
  },
  recentSearchTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  searchHistory: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  historyText: {
    fontSize: 16,
    color: '#333',
  },
  noResultText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  itemDog: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
  },
});
