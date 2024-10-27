import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Petcare = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dịch vụ Spa</Text>

            <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.card} 
                onPress={() => navigation.navigate('Petcare2')}
            >
                <Image source={require('../Image/petcare.png')}
                    style={styles.image}
                />
                <Text style={styles.cardText}>Dịch vụ Spa thú cưng</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.card}
                onPress={() => navigation.navigate('Petcare2')}
            >
                <Image source={require('../Image/pet2.png')}
                    style={styles.image}
                />
                <Text style={styles.cardText}>Chăm sóc chó mèo</Text>
            </TouchableOpacity>

        </View>
    )
}

export default Petcare

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',  
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',  
        marginBottom: 20,
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
    }
})
