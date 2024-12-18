import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ToastAndroid, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { URL } from './HomeScreen'; // Đảm bảo URL đã được định nghĩa
import AsyncStorage from '@react-native-async-storage/async-storage';
import { numberUtils, upperCaseItem } from "./utils/stringUtils";

const SearchScreen = ({ navigation }) => {
  const [txtSearch, setTxtSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [emailUser, setEmailUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [ListSearch, setListSearch] = useState([]); // Lịch sử tìm kiếm

  useEffect(() => {
    const fetchUserEmail = async () => {
      const userEmail = await AsyncStorage.getItem('@UserLogin');
      if (userEmail) {
        setEmailUser(userEmail);
      }
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (emailUser) {
      const fetchSearchHistory = async () => {
        try {
          const response = await axios.get(`${URL}/searchs/history`, { params: { emailUser } });
          setListSearch(response.data || []);
        } catch (error) {
          console.error("Lỗi khi lấy lịch sử tìm kiếm:", error);
        }
      };
      fetchSearchHistory();
    }
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
          console.error("Lỗi tìm kiếm:", error.response ? error.response.data : error.message);
          ToastAndroid.show('Không thể tìm kiếm sản phẩm!', ToastAndroid.SHORT);
        } finally {
          setLoading(false);
        }
      } else {
        setProducts([]); // Xóa kết quả khi không có nội dung tìm kiếm
      }
    };

    const delayDebounceFn = setTimeout(() => {
      searchProducts();
    }, 1000); // Thời gian trễ để tránh gửi yêu cầu quá nhiều

    return () => clearTimeout(delayDebounceFn);
  }, [txtSearch, emailUser]);

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.icon} source={require('../Image/left-back.png')} />
        </TouchableOpacity>
        <Text style={styles.title}>TÌM KIẾM</Text>
        <TouchableOpacity onPress={resetSearch}>
          <Image style={styles.icon} source={require('../Image/reset.png')} />
        </TouchableOpacity>
      </View>

      <View style={styles.search}>
        <TextInput
          onChangeText={handleSetTxtSearch}
          value={txtSearch}
          placeholder="Tìm kiếm"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        <TouchableOpacity
          // onPress={resetSearch}
        >
          <Image source={require('../Image/search.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listSearch}>
        {loading ? (
          <ActivityIndicator size="large" color="#A05E56" />
        ) : (
          <>
            {txtSearch === "" ? (
              <View style={{}}>
                <Text style={styles.recentSearchTitle}>Tìm kiếm gần đây</Text>
                <FlatList
                  scrollEnabled={false}
                  data={ListSearch}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.searchHistory}>

                      <Image style={styles.icon} source={require('../Image/clock.png')} />
                      <Text style={styles.historyText} onPress={() => handleSetTxtSearch(item.txt)}>
                        {item.txt}
                      </Text>

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
                        <TouchableOpacity
                          onPress={() => navigation.navigate('DetailScreen', { item })}
                          style={styles.item}
                        >
                          <Image source={{ uri: item.img }} style={styles.itemImage} />
                          <View style={styles.itemDetails}>
                            <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
                              {item.name}
                            </Text>
                            <Text style={styles.productPrice}>{numberUtils(item.size[0].price)}</Text>

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
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  search: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginStart: 10,
    marginEnd: 10,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#A05E56',
  },
  listSearch: {
    marginTop: 15,
    flexGrow: 1,
  },
  recentSearchTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  searchHistory: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 5,
  },
  historyText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  item: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 5,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
    resizeMode: "contain"
  },
  itemDetails: {
    flex: 1,
    gap: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    overflow: 'hidden',
    width: '100%',  // Đảm bảo chiếm toàn bộ chiều rộng của cha
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