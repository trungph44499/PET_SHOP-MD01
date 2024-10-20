import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';

const TransactionHistory = () => {
  const transactions = [
    {
      id: '1',
      date: '2024-10-18',
      image: 'https://via.placeholder.com/100', 
      status: 'Đã giao',
      productName: 'Sản phẩm A',
      quantity: 2,
    },
    {
      id: '2',
      date: '2024-10-19',
      image: 'https://via.placeholder.com/100', 
      status: 'Chờ xử lý',
      productName: 'Sản phẩm B',
      quantity: 1,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Chỉnh sửa vị trí của tiêu đề và nút quay lại */}
        <TouchableOpacity onPress={() => { /* logic quay lại */ }}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Lịch sử giao dịch</Text>
      </View>

      {/* Danh sách lịch sử giao dịch */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            {/* Ngày tháng giao dịch */}
            <Text style={styles.transactionDate}>
              <Text style={styles.boldText}>Ngày giao dịch:</Text> {item.date}
            </Text>

            {/* Thông tin giao dịch */}
            <View style={styles.transactionInfo}>
              {/* Ảnh sản phẩm */}
              <Image source={{ uri: item.image }} style={styles.productImage} />

              {/* Thông tin đơn hàng */}
              <View style={styles.productDetails}>
                <Text><Text style={styles.boldText}>Trạng thái:</Text> {item.status}</Text>
                <Text><Text style={styles.boldText}>Tên sản phẩm:</Text> {item.productName}</Text>
                <Text><Text style={styles.boldText}>Số lượng:</Text> {item.quantity}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1, 
    textAlign: 'center', 
  },
  backButton: {
    fontSize: 24, 
    fontWeight: 'bold',
    padding: 10, 
  },
  transactionItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  transactionDate: {
    fontSize: 16,
    marginBottom: 10,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
  productDetails: {
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default TransactionHistory;
