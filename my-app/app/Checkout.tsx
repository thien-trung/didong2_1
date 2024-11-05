import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
    Cart: undefined; 
    Checkout: CheckoutParams; 
};

interface Product {
    id: string;
    name: string;
    photo: string;
    price: number;
    quantity: number;
}

interface CheckoutParams {
    total: number;
    selectedItems: Product[];
}

type Props = StackScreenProps<RootStackParamList, 'Checkout'>;

const Checkout: React.FC<Props> = ({ route, navigation }) => {
    const { total, selectedItems } = route.params;

    const handleConfirm = () => {
        Alert.alert('Payment confirmed!', `You have paid a total of ${total.toLocaleString()} $`);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Checkout</Text>
            <Text style={styles.totalText}>Total Amount: {total.toLocaleString()} $</Text>
            <Text style={styles.subTitle}>Selected Items:</Text>
            {selectedItems.map(item => (
                <View key={item.id} style={styles.itemContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()} $</Text>
                    <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                </View>
            ))}
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm Payment</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    totalText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#28A745',
        marginBottom: 20,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
    itemContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '600',
    },
    itemPrice: {
        fontSize: 16,
        color: '#28A745',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#555',
    },
    confirmButton: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Checkout;
