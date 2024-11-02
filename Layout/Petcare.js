import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

const Petcare = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const showModal = (service) => {
        let content;
        if (service === 'Spa') {
            content = 'Dịch vụ Spa thú cưng bao gồm tắm rửa, chăm sóc lông và thư giãn cho thú cưng của bạn.';
        } else if (service === 'Chăm sóc') {
            content = 'Dịch vụ Chăm sóc chó mèo bao gồm dinh dưỡng, sức khỏe và chơi đùa cho thú cưng của bạn.';
        }
        setModalContent(content);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../Image/back.png")}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Dịch vụ chăm sóc thú cưng</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.card}
                    onPress={() => showModal('Spa')}
                    accessibilityLabel="Đi đến dịch vụ Spa"
                >
                    <Image
                        source={require('../Image/petcare.png')}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <Text style={styles.cardText}>Dịch vụ Spa thú cưng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.card}
                    onPress={() => showModal('Chăm sóc')}
                    accessibilityLabel="Đi đến Chăm sóc thú cưng"
                >
                    <Image
                        source={require('../Image/pet3.png')}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <Text style={styles.cardText}>Dịch vụ khám sức khỏe</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.card}
                    onPress={() => navigation.navigate('Petcare2')}
                    accessibilityLabel="Đăng ký dịch vụ"
                >
                    <Text style={styles.cardText}>Đăng ký dịch vụ</Text>
                </TouchableOpacity>

                {/* Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>{modalContent}</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

export default Petcare;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        marginBottom: 20,
      
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        flex: 1, // Cho phép tiêu đề chiếm không gian giữa
        textAlign: 'center', // Căn giữa văn bản
    },
    card: {
        width: 280,
        borderRadius: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
        padding: 10,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 15,
        marginBottom: 10,
    },
    cardText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#444',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },

});
