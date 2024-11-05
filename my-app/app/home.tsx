// app/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, Text, View, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useProductContext } from '@/context/ProductContext'; // Import context
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

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
  const [keyword, setKeyword] = useState('');
  const navigation = useNavigation();
  const { setSelectedCategory } = useProductContext(); // Lấy hàm từ context

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [searchQuery, setSearchQuery] = useState(''); // Thêm state cho searchQuery
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
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
  const handleSearch = () => {
    console.log("Từ khóa tìm kiếm:", searchQuery); // Log từ khóa tìm kiếm trước khi gửi request
    
    axios.get("http://127.0.0.1:8000/api/product/search", {
      params: { query: searchQuery },
    })
    .then((response) => {
      console.log("Kết quả tìm kiếm:", response.data);
      setSearchResults(response.data); 
      navigation.navigate('SearchResultsScreen', { results: response.data });
    })
    .catch((error) => {
      console.error("Lỗi khi tìm kiếm:", error);
    });
  };

  const fetchProductsByCategory = async (categoryId: number) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/categories/${categoryId}/products`);
        if (response.status === 200) {
            setProducts(response.data); 
        } else {
            console.error("Lỗi khi lấy sản phẩm:", response.data);
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
};

// const addToCart = async (productId: string, quantity: number, price: number) => {
//     try {
//         const token = await AsyncStorage.getItem('jwt_token');
        
//         const response = await fetch("http://127.0.0.1:8000/api/product/cart-list", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 productId,
//                 quantity,
//                 price,
//             }),
//         });
        
//         if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
//             const data = await response.json();
            
//             if (response.status === 200) {
//                 Toast.show({
//                     type: 'success',
//                     text1: 'Thành công',
//                     text2: 'Sản phẩm đã được thêm vào giỏ hàng',
//                     visibilityTime: 2000, 
//                 });
//             } else {
//                 console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", data);
//                 Toast.show({
//                     type: 'error',
//                     text1: 'Lỗi',
//                     text2: 'Có lỗi xảy ra. Vui lòng thử lại.',
//                 });
//             }
//         } else {
//             const errorText = await response.text();
//             console.error("Phản hồi không phải là JSON:", errorText);
//             Toast.show({
//                 type: 'error',
//                 text1: 'Lỗi',
//                 text2: 'Có lỗi xảy ra. Vui lòng thử lại.',
//             });
//         }
//     } catch (error) {
//         console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
//         Toast.show({
//             type: 'error',
//             text1: 'Lỗi',
//             text2: 'Có lỗi xảy ra. Vui lòng thử lại.',
//         });
//     }
// };
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

const handleLogout = () => {
  router.push('/');
  setModalVisible(false); 
};
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="menu" size={30} color="white" />
            </TouchableOpacity>

            {/* Modal cho Logout */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.menu}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Đóng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                            <Text style={styles.menuText}>Đăng xuất</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        <View style={styles.searchBar}>
          <TextInput 
            style={styles.input} 
            placeholder="Tìm kiếm sản phẩm..." 
            placeholderTextColor="#888" 
            value={searchQuery} 
            onChangeText={setSearchQuery}
            
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={25} color="white" style={styles.searchIcon} />
          </TouchableOpacity>
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
              onPress={() => {
                fetchProductsByCategory(category.id);
                navigation.navigate('CategoryProducts', { categoryId: category.id });
              }}
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


modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
menu: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
},
closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
},
closeText: {
    color: 'red',
    fontSize: 16,
},
menuItem: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
},
menuText: {
    fontSize: 18,
},
});
