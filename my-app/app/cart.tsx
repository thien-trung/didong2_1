import React, { useEffect, useState } from 'react'; 
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
    id: string;
    product_id: string;
    name: string;
    photo: string;
    price: number;
    quantity: number;
}

interface Product {
    id: string;
    name: string;
    photo: string;
    price: number;
}

interface CheckoutParams {
    total: number;
    selectedItems: CartItem[];
}

type RootStackParamList = {
    Checkout: CheckoutParams;
};

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
    const navigation = useNavigation<CartScreenNavigationProp>();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = await AsyncStorage.getItem('jwt_token');
                const response = await axios.get(`http://127.0.0.1:8000/api/product/cart-list`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                Alert.alert('An error occurred while loading the cart.');
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/products`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching product list:', error);
                Alert.alert('An error occurred while loading the product list.');
            }
        };

        fetchCartItems();
        fetchProducts();
    }, []);

    const handleRemoveItem = async (itemId: string) => {
        try {
            const token = await AsyncStorage.getItem('jwt_token');
            await axios.delete(`http://127.0.0.1:8000/api/product/cart-list/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems(cartItems.filter(item => item.id !== itemId));
            Alert.alert('Product has been removed from the cart.');
        } catch (error) {
            console.error('Error removing product from cart:', error);
            Alert.alert('An error occurred while removing the product.');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            if (selectedItems[item.id]) {
                return total + (item.price * item.quantity);
            }
            return total;
        }, 0);
    };

    const handleCheckout = () => {
        const total = calculateTotal();
        const selectedCartItems = cartItems.filter(item => selectedItems[item.id]);
        if (total > 0) {
            navigation.navigate('Checkout', { total, selectedItems: selectedCartItems });
        } else {
            Alert.alert('Please select at least one item to proceed to checkout.');
        }
    };

    const filteredProducts = products.filter(product =>
        cartItems.some(cartItem => cartItem.product_id === product.id)
    );


  

    const renderCartItem = ({ item }: { item: Product }) => {
        const cartItem = cartItems.find(cart => cart.product_id === item.id);
        return (
            <View style={styles.cartItem}>
                <TouchableOpacity style={styles.cartItemContent}>
                    <Image 
                        source={{ uri: `http://127.0.0.1:8000/storage/products/${item.photo}` }} 
                        style={styles.productImage} 
                    />
                    <View style={styles.productDetails}>
                        <TouchableOpacity>
                            <Text style={styles.productName}>{item.name}</Text>
                        </TouchableOpacity>
                        <Text style={styles.productPrice}>{(cartItem?.price || 0).toLocaleString()} VMD</Text>
                        <Text style={styles.productQuantity}>Quantity: {cartItem?.quantity}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.delete} onPress={() => handleRemoveItem(cartItem?.id || '')}>
                    <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>

                <Checkbox
                    value={selectedItems[cartItem?.id || ''] || false}
                    onValueChange={() => {
                        setSelectedItems(prev => {
                            const updatedSelectedItems = { ...prev, [cartItem?.id || '']: !prev[cartItem?.id || ''] };
                            return updatedSelectedItems;
                        });
                    }}
                />
            </View>
        );
    };

    const totalAmount = calculateTotal();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giỏ Hàng</Text>
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={renderCartItem}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Tổng tiền: {totalAmount.toLocaleString()} VMD</Text>
                <TouchableOpacity style={styles.checkoutButton} >
                    <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
                </TouchableOpacity>
            </View>
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
        color: '#333',
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    cartItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 5,
        marginRight: 15,
    },
    productDetails: {
        flex: 1,
        paddingVertical: 5,
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    productPrice: {
        fontSize: 16,
        color: '#28A745',
        marginTop: 5,
    },
    productQuantity: {
        fontSize: 14,
        color: '#555',
        marginTop: 3,
    },
    totalContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    checkoutButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    delete: {  
      marginEnd:15,    
      marginTop:22,  
      },
});

export default Cart;
