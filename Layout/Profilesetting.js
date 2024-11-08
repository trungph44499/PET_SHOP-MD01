import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const Profilesetting = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image style={styles.icon} source={require('../Image/back.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Setting</Text>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.navigate("ManageUser")} style={styles.optionButton}>
          <Text style={styles.optionText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate("PassReset")} style={styles.optionButton}>
          <Text style={styles.optionText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profilesetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', 
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', 
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
    zIndex: 1,
  },
  icon: {
    width: 24,
    height: 24,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333', 
  },
  content: {
    paddingTop: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF', 
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
  },
  optionText: {
    fontSize: 16,
    color: '#333333', 
    textAlign: 'center',
  },
});
