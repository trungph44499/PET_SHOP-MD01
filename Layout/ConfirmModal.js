import React, { useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated } from 'react-native';

const ConfirmModal = ({ visible, onClose, onConfirm }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, { opacity: fadeAnim }]}>
          <Text style={styles.textBold}>Xác nhận xóa đơn hàng?</Text>
          <Text style={styles.textInfo}>Thao tác này sẽ không thể khôi phục.</Text>
          <Pressable style={styles.btnModal} onPress={onConfirm}>
            <Text style={styles.btnText}>Đồng ý</Text>
          </Pressable>
          <Pressable onPress={onClose}>
            <Text style={styles.cancelText}>Hủy bỏ</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '90%',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textBold: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInfo: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  btnModal: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#a97053',
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontWeight: 'bold', 
  },
  cancelText: {
    textDecorationLine: 'underline', 
    fontWeight: 'bold', 
    fontSize: 16
  },
});

export default ConfirmModal; // Đảm bảo xuất component
