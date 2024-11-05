import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: string;
  name: string;
  price: number;
  photo: string; 
}

interface RouteParams {
  categoryId: number; 
}

export default function CategoryProducts() {
  const navigation = useNavigation();

  const route = useRoute();
  const { categoryId } = route.params as RouteParams; 
  const [products, setProducts] = useState<Product[]>([]); 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/categories/${categoryId}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products by category:', error);
      }
    };

    fetchProducts();
  }, [categoryId]);
  const addToCart = async (productId:string, quantity:number, price:number) => {
    try {
        const token = await AsyncStorage.getItem('jwt_token');
        
        const response = await fetch("http://127.0.0.1:8000/api/product/cart-list", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                productId,
                quantity,
                price,
            }),
        });
        
        // Kiểm tra nếu phản hồi là JSON
        if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
            const data = await response.json();
            
            if (response.status === 200) {
                alert(data.message);
            } else {
                console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", data);
                alert("Có lỗi xảy ra. Vui lòng thử lại.");
            }
        } else {
            // In ra nội dung khi không phải JSON
            const errorText = await response.text();
            console.error("Phản hồi không phải là JSON:", errorText);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
};
  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productItem}>
      <Image 
        source={{ uri: `http://127.0.0.1:8000/storage/products/${item.photo}` }} 
        style={styles.productImage} 
      />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} VND</Text>
      <View style={styles.buttonContainer}>
              <TouchableOpacity 
                    style={styles.buyButton} 
                    onPress={() => addToCart(item.id, 1, item.price)} 
                  >
                    <Ionicons name="cart" size={24} color="white" />
              </TouchableOpacity>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('ProductDetail', { product: item })}
                >
                  <Text style={styles.buttonText}>Chi tiết</Text>
                </TouchableOpacity>
              </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản phẩm trong danh mục</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2} 
        columnWrapperStyle={styles.columnWrapper} 
      />
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e9ecef', 
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  buyButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  detailsButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28, 
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#343a40', 
  },
  productItem: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 12, 
    padding: 15, 
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productImage: {
    width: 120, 
    height: 120,
    resizeMode: 'cover',
    marginBottom: 5,
    borderRadius: 8, 
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#495057', 
    marginVertical: 5, 
  },
  productPrice: {
    fontSize: 16, 
    color: '#28A745',
    fontWeight: 'bold',
  },
});