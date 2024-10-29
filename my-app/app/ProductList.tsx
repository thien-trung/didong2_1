



// ProductListScreen.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { ProductContext } from '@/context/ProductContext';
export interface Product {
    id: string; 
    name: string; 
    photo: string; 
    description: string; 
    price: number; 
  }
const ProductList = () => {
  const { selectedCategory } = useContext(ProductContext); // Lấy danh mục đã chọn
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`http://127.0.0.1:8000/api/products?category_id=${selectedCategory.id}`)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy sản phẩm:", error);
        });
    }
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản phẩm theo danh mục: {selectedCategory.name}</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image source={{ uri: `http://127.0.0.1:8000/storage/products/${item.photo}` }} style={styles.productImage} />
            <Text>{item.name}</Text>
            <Text>{item.price.toLocaleString()} VND</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productItem: {
    marginBottom: 16,
  },
  productImage: {
    width: 100,
    height: 100,
  },
});

export default ProductList;
