import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { URL } from "./HomeScreen";
import { useFocusEffect } from '@react-navigation/native';

const PaymentMethod = ({ navigation, route }) => {
    // const [user, setUser] = useState({});

    // const retrieveData = async () => {
    //     try {
    //         const userData = await AsyncStorage.getItem("@UserLogin");

    //         const {
    //             status,
    //             data: { response },
    //         } = await axios.post(`${URL}/users/getUser`, {
    //             email: userData,
    //         });
    //         if (status == 200) {
    //             setUser(...response);
    //             console.log("User ID:", response.emai);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // useFocusEffect(
    //     useCallback(() => {
    //       retrieveData();
    //     }, [])
    //   );

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
