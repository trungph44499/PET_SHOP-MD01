import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { URL } from './HomeScreen';

const SearchScreen = ({ navigation }) => {

  const [txtSearch, settxtSearch] = useState('');
  const [result, setresult] = useState(false)
  const [ListSearch, setListSearch] = useState([]);
  const [ListDog, setListDog] = useState([]);
  const [ListCat, setListCat] = useState([]);
  const [ListPhuKien, setListPhuKien] = useState([]);

  const getListSearch = async () => {
    let url = `${URL}/search`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setListSearch(data);
    } catch (err) {
      console.log(err);
    }
  }
  const deleteSearch = async (id) => {
    try {
      const url = `${URL}/search/${id}`;
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) getListSearch();
    } catch (err) {
      console.log(err);
    }
  }

  const addSearch = async () => {
    if (txtSearch == "") {
      return;
    }
    const listSearch = Array.from(new Set(ListSearch.map(item => item.txt)));
    console.log(listSearch);
    for (const txt of listSearch) {
      if (txtSearch == txt) {
        setresult(true);
        return;
      }
    }

    const Txtsearch = {
      txt: txtSearch
    }
    let url = `${URL}/search`;
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(Txtsearch)
    })
      .then(res => {
        if (res.ok) {
          setresult(true)
          getListSearch();
        }
      })
      .catch(err => console.log(err))
  }

  const getListDog = async () => {
    if (txtSearch == "") {
      return;
    }
    let url = `${URL}/dogs?name=${txtSearch}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setListDog(data);
    } catch (err) {
      console.log(err);
    }
  }

  const getListCat = async () => {
    if (txtSearch == "") {
      return;
    }
    let url = `${URL}/cats?name=${txtSearch}`;
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        setListCat(data);
      })
      .catch(err => console.log(err))
  }

  const getListPhuKien = async () => {
    if (txtSearch == "") {
      return;
    }
    let url = `${URL}/phukien?name=${txtSearch}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setListPhuKien(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (txtSearch == "") {
      setresult(false)
    }
    getListDog();
    getListCat();
    getListSearch();
    getListPhuKien();
    deleteSearch();
  }, [txtSearch])

  const handleSetTxtSearch = (txt) => {
    settxtSearch(txt);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => settxtSearch("")}>
          <Image style={{ width: 20, height: 20 }}
            source={require('../Image/reset.png')} />
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>TÌM KIẾM</Text>
        <View style={{ width: 50 }}></View>
      </View>

      <View style={styles.search}>

        <TextInput onChangeText={(txt) => handleSetTxtSearch(txt)} value={txtSearch}
          placeholder='Search' style={{ marginStart: 10, marginEnd: 10, flex: 1 }} />
        <TouchableOpacity onPress={() => { addSearch() }}>
          <Image source={require('../Image/search.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.listSearch}>
        {!result || txtSearch == ""
          ?
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 15 }}>Tìm kiếm gần đây</Text>
            <FlatList
              scrollEnabled={false}
              data={ListSearch}
              keyExtractor={item => item.id}
              renderItem={({ item }) =>
                <View style={styles.searchHistory}>
                  <View style={{ flexDirection: 'row', gap: 20 }}>
                    <Image style={styles.icon} source={require('../Image/clock.png')} />
                    <Text onPress={() => { settxtSearch(item.txt) }}>{item.txt}</Text>
                  </View>
                  <TouchableOpacity onPress={() => { deleteSearch(item.id) }}>
                    <Image style={styles.icon} source={require('../Image/cancel.png')} />
                  </TouchableOpacity>
                </View>} >
            </FlatList>
          </View>
          :
          <View>
            {ListDog.length == 0 && ListCat.length == 0 && ListPhuKien.length == 0
              ?
              <Text style={{ fontSize: 15 }}>Không tìm thấy</Text>
              :

              <View style={{ gap: 12 }}>
                <Text style={{ fontSize: 15 }}>Kết quả tìm kiếm</Text>
                {
                  ListDog.length != 0
                    ?
                    <View style={{ gap: 10 }}>
                      <Text>Sản Phẩm</Text>
                      <FlatList
                        scrollEnabled={false}
                        data={ListDog}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) =>
                          <TouchableOpacity onPress={() => { navigation.navigate('DetailProduct', { item: item }) }}
                            style={styles.itemDog}>
                            <Image source={{ uri: item.img }}
                              style={styles.itemImage} />
                            <View style={{ gap: 5 }}>
                              <Text style={styles.price}>{item.name}</Text>
                              <Text style={{ fontSize: 16, color: '#EB4F26', fontWeight: "800" }}>{item.price} </Text>
                              <Text style={{ fontSize: 12 }}>{item.id}.</Text>
                              <Text style={{ fontSize: 12, fontWeight: "600" }}>Còn {item.quantity} sp</Text>
                            </View>
                          </TouchableOpacity>} >
                      </FlatList>
                    </View>
                    : <View></View>
                }

                {
                  ListCat.length != 0
                    ?
                    <View style={{ gap: 10 }}>
                      <Text>Sản Phẩm</Text>
                      <FlatList
                        scrollEnabled={false}
                        data={ListCat}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) =>
                          <TouchableOpacity onPress={() => { navigation.navigate('DetailProduct', { item: item }) }}
                            style={styles.itemDog}>
                            <Image source={{ uri: item.img }}
                              style={styles.itemImage} />
                            <View style={{ gap: 5 }}>
                              <Text style={styles.price}>{item.name}</Text>
                              <Text style={{ fontSize: 16, color: '#EB4F26', fontWeight: "800" }}>{item.price} </Text>
                              <Text style={{ fontSize: 12 }}>{item.id}</Text>
                              <Text style={{ fontSize: 12, fontWeight: "600" }}>Còn {item.quantity} sp</Text>
                            </View>
                          </TouchableOpacity>} >
                      </FlatList>
                    </View>
                    : <View></View>
                }

                {
                  ListPhuKien.length != 0
                    ?
                    <View style={{ gap: 10 }}>
                      <Text>Sản Phẩm</Text>
                      <FlatList
                        scrollEnabled={false}
                        data={ListPhuKien}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) =>
                          <TouchableOpacity onPress={() => { navigation.navigate('DetailProduct', { item: item }) }}
                            style={styles.itemDog}>
                            <Image source={{ uri: item.img }}
                              style={styles.itemImage} />
                            <View style={{ gap: 5 }}>
                              <Text style={styles.price}>{item.name}</Text>
                              <Text style={{ fontSize: 16, color: '#EB4F26', fontWeight: "800" }}>{item.price} </Text>
                              <Text style={{ fontSize: 12 }}>{item.id}</Text>
                              <Text style={{ fontSize: 12, fontWeight: "600" }}>Còn {item.quantity} sp</Text>
                            </View>
                          </TouchableOpacity>} >
                      </FlatList>
                    </View>
                    : <View></View>
                }
              </View>}
          </View>
        }
      </View>
    </View>
  )
}

export default SearchScreen

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
    gap: 12
  },
  itemDog: {
    padding: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    gap: 30
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12
  },
  price: {
    fontSize: 17,
    fontWeight: '600',
  }
})