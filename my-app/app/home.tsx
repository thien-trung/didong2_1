// app/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, Text, View, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useProductContext } from '@/context/ProductContext'; // Import context

export interface Product {
  id: string; 
  name: string; 
  photo: string; 
  description: string; 
  price: number; 
}

export interface Category {
  id: number;
  name: string;
}

export default function HomeScreen() {
  const navigation = useNavigation(); 
  const { setSelectedCategory } = useProductContext(); // Lấy hàm từ context

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch categories
    axios.get("http://127.0.0.1:8000/api/product/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error); 
      });

    // Fetch products
    axios.get("http://127.0.0.1:8000/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm:", error); 
      });
  }, []);

  const banners = [
    require('@/assets/images/slider/slider01.png'),
    require('@/assets/images/slider/slider02.png'),
    require('@/assets/images/slider/slider03.png'),
  ];
 
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput style={styles.input} placeholder="Tìm kiếm sản phẩm..." placeholderTextColor="#888" />
          <Ionicons name="search" size={25} color="white" style={styles.searchIcon} />
          <TouchableOpacity style={styles.cartIcon} onPress={() => navigation.navigate('cart')}>
            <Ionicons name="cart" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryItem}
              
            >
              <Text>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Banner slider */}
      <FlatList
        data={banners}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image style={styles.sliderImage} source={item} />
        )}
      />

      {/* Product list */}
      <View style={styles.productContainer}>
        <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>
        <View style={styles.underline} />
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Image style={styles.productImage} source={{ uri: `http://127.0.0.1:8000/storage/products/${item.photo}` }} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price.toLocaleString()} VND</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buttonText}>Mua</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('ProductDetail', { product: item })}
                >
                  <Text style={styles.buttonText}>Chi tiết</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginVertical: 15,
  },
  sliderImage: {
    width: 450,
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: 45,
    borderRadius: 8,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  categoryContainer: {
    marginVertical: 5,
    marginHorizontal: 7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  categories: {
    flexDirection: 'row',
  },
  categoryItem: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    elevation: 1,
  },
  productContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  productItem: {
    flex: 1,
    margin: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  productPrice: {
    marginTop: 5,
    fontSize: 14,
    color: '#28A745',
    fontWeight: 'bold',
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
  header: {
    backgroundColor: '#FF6347',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  menuButton: {
    padding: 5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginLeft: -10,
  },
  searchIcon: {
    marginRight: 10,
    marginLeft: 5,
  },
  cartIcon: {
    marginLeft: 5,
  },
  underline: {
    width: '100%',
    height: 2,
    backgroundColor: '#000000',
    marginBottom: 3,
  },
});
