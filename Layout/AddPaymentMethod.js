import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';

const AddPaymentMethod = ({ navigation }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleExpiryDateChange = (text) => {
        if (text.length === 0) {
            setExpiryDate('');
        } else if (text.length === 2 && !text.includes('/')) {
            const month = parseInt(text, 10);
            if (month > 12) {
                Alert.alert('Lỗi', 'Tháng không hợp lệ');
                setExpiryDate('');
            } else {
                setExpiryDate(text + '/');
            }
        } else if (text.length === 5) {
            const [month, year] = text.split('/');
            if (parseInt(year, 10) < 24) {
                Alert.alert('Lỗi', 'Năm không hợp lệ');
            } else {
                setExpiryDate(text);
            }
        } else {
            setExpiryDate(text);
        }
    };
    
    const handleCardNumberChange = (text) => {
        if (text.length <= 16) {
            setCardNumber(text);
        }
    };
    const handleCvvChange = (text) => {
        if (text.length <= 3) {
            setCvv(text);
        }
    };

    const formatCardNumber = (number) => {
        return number.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const handleAddCard = () => {
            Alert.alert('Thành công', 'Thẻ đã được thêm thành công');

    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image style={styles.icon} source={require('../Image/back.png')} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Thêm thẻ thanh toán</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.cardPreview}>
                    <View style={styles.cardHeader}>
                        {/* <Image
                            source={require('../Image/chip.png')} // Bạn cần thêm hình ảnh chip thẻ
                            style={styles.chipImage}
                        />
                        <Image
                            source={require('../Image/visa.png')} // Bạn cần thêm logo visa
                            style={styles.visaLogo}
                        /> */}
                    </View>
                    <Text style={styles.cardLabelSo}>SỐ THẺ</Text>
                    <Text style={styles.cardNumber}>{formatCardNumber(cardNumber) || '**** **** **** ****'}</Text>

                    <View style={styles.cardFooter}>
                        <View>
                            <Text style={styles.cardLabel}>CHỦ THẺ</Text>
                            <Text style={styles.cardValueName}>{cardHolder || 'NAME'}</Text>
                        </View>

                        <View>
                            <Text style={styles.cardLabel}>HẾT HẠN</Text>
                            <Text style={styles.cardValue}>{expiryDate || 'MM/YY'}</Text>
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>CVV</Text>
                            <Text style={styles.cardValueCvv}>{cvv || '***'}</Text>
                        </View>
                    </View>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Số thẻ"
                    keyboardType="numeric"
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Tên chủ thẻ"
                    value={cardHolder}
                    onChangeText={setCardHolder}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ngày hết hạn (MM/YY)"
                    keyboardType="numeric"
                    value={expiryDate}
                    onChangeText={handleExpiryDateChange}
                    maxLength={5}
                />
                <TextInput
                    style={styles.input}
                    placeholder="CVV"
                    keyboardType="numeric"
                    value={cvv}
                    secureTextEntry
                    onChangeText={handleCvvChange}
                />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleAddCard}>
                <Text style={styles.submitText}>Thêm thẻ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddPaymentMethod;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        top: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 30,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        zIndex: 1,
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    icon: {
        width: 20,
        height: 20,
    },
    content: {
        flex: 1,
        marginTop: 20,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardPreview: {
        height: 200,
        backgroundColor: 'black', // Màu xanh của Visa
        borderRadius: 16,
        padding: 24,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chipImage: {
        width: 50,
        height: 40,
        resizeMode: 'contain',
    },
    visaLogo: {
        width: 70,
        height: 30,
        resizeMode: 'contain',
    },
    cardNumber: {
        color: '#fff',
        fontSize: 24,
        letterSpacing: 2,
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    cardLabel: {
        color: '#ffffff80',
        fontSize: 12,
        marginBottom: 5,
    },
    cardLabelSo: {
        color: '#ffffff80',
        fontSize: 12,
        marginTop: 10,
    },
    cardValue: {
        color: '#fff',
        fontSize: 16,
        textTransform: 'uppercase',
    },
    cardValueName: {
        color: '#fff',
        fontSize: 16,
        textTransform: 'uppercase',
        width: 160,
    },
    cardValueCvv: {
        color: '#fff',
        fontSize: 16,
        textTransform: 'uppercase',
        width: 30,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
});
