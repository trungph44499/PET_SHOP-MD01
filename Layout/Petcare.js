import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

const services = [
    {
        name: 'Spa',
        intro: 'Giới thiệu về dịch vụ Spa',
        description: [
            "Quy trình tắm trọn gói 8 bước:",
            "- Vệ sinh nhổ lông tai.",
            "- Cạo bàn, cắt, mài móng.",
            "- Cạo lông bụng.",
            "- Vệ sinh tuyến hôi.",
            "- Tắm dưỡng xả lông.",
            "- Massage.",
            "- Sấy đánh bông lông.",
        ],
        image: require('../Image/petcare.png'),
    },
    {
        name: 'Chăm sóc',
        intro: 'Giới thiệu về dịch vụ Chăm sóc',
        description: [
            "Quy trình tắm trọn gói 12 bước:",
            "- Kiểm tra sức khỏe cơ bản .",
            "- Cạo bàn, cắt, mài móng.",
            "- Cạo lông bụng.",
            "- Vệ sinh tuyến hôi.",
            "- Tắm dưỡng xả lông.",
            "- Vệ sinh tai, nhổ lông tai.",
            "- Sấy khô lông.",
            "- Gỡ rối, đánh tơi lông.",
            "- Kiểm tra tai sau khi tắm.",
            "- Tỉa gọn lông vùng mắt.",
            "- Thoa dưỡng và thơm lông..",
        ],
        image: require('../Image/pet3.png'),
    },
];

const Petcare = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ intro: '', description: [] });

    const showModal = (service) => {
        const content = services.find(s => s.name === service);
        setModalContent(content || { intro: '', description: [] });
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Quay lại">
                    <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../Image/back.png")}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Dịch vụ chăm sóc thú cưng </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
                {services.map(service => (
                    <TouchableOpacity
                        key={service.name}
                        activeOpacity={0.8}
                        style={styles.card}
                        onPress={() => showModal(service.name)}
                        accessibilityLabel={`Đi đến dịch vụ ${service.name}`}
                    >
                        <Image
                            source={service.image}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <Text style={styles.cardText}>{`Dịch vụ ${service.name}`}</Text>
                    </TouchableOpacity>
                ))}
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
                            <Text style={styles.modalTitle}>Thông tin dịch vụ</Text>
                            <Text style={styles.modalSubTitle}>{modalContent.intro}</Text>
                            {modalContent.description.map((text, index) => (
                                <Text key={index} style={[styles.modalText, { textAlign: 'left' }]}>
                                    {text}
                                </Text>
                            ))}
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
        color: '#333',
        flex: 1,
        textAlign: 'center',
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
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center', // Căn giữa cho tiêu đề
    },
    modalSubTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'left', // Căn trái cho tiêu đề phụ
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'left', // Căn trái cho mô tả
    },
    closeButton: {
        backgroundColor: '#a97053',
        padding: 10,
        borderRadius: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold'
    },
});
