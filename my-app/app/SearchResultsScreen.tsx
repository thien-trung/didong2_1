import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Product } from './home'; // Đảm bảo bạn đã xuất Product từ HomeScreen
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';

type SearchResultsScreenRouteProp = RouteProp<{ 
  SearchResultsScreen: { results: Product[] }; 
}, 'SearchResultsScreen'>;

const SearchResultsScreen: React.FC = () => {
  const navigation = useNavigation();

  const route = useRoute<SearchResultsScreenRouteProp>();
  const { results } = route.params; // Truy cập các tham số đã được truyền vào

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kết quả tìm kiếm</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image 
              style={styles.productImage} 
              source={{ uri: `http://127.0.0.1:8000/storage/products/${item.photo}` }} 
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price.toLocaleString()} VND</Text>
              <View style={styles.buttonContainer}>
              <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('ProductDetail', { product: item })}
                >
                  <Text style={styles.buttonText}>Chi tiết sản phẩm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent} // Thêm khoảng cách cho FlatList
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  productItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  productImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productInfo: {
    marginTop: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    marginTop: 5,
    fontSize: 16,
    color: '#28A745',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default SearchResultsScreen;
