import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const PaymentMethod = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image style={styles.icon} source={require('../Image/back.png')} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Phương thức thanh toán</Text>
            </View>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddPaymentMethod')}
            >
                <Image style={styles.addIcon} source={require('../Image/add.png')} />
            </TouchableOpacity>
            <View>
                
            </View>
        </View>
    );
};

export default PaymentMethod;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        width: 25,
        height: 25,
        tintColor: 'white',
    },
});
