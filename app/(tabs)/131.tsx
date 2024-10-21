// import React, { useEffect, useState } from 'react';
// import { Ionicons } from '@expo/vector-icons';
// import { TextInput, Text, View, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
// import { useNavigation } from '@react-navigation/native'; 
// import axios from 'axios';

// export interface Product {
//   id: string; // Hoặc number, tùy vào kiểu dữ liệu trong MySQL
//   name: string;
//   image_name: string;
//   price: number; // Hoặc string nếu giá được lưu dưới dạng chuỗi
//   // Thêm bất kỳ thuộc tính nào khác mà bạn nhận từ API
//   imageUrl?:string;
// }

// export default function HomeScreen() {
//   const navigation = useNavigation(); // Khai báo useNavigation

//   const categories = ['Điện thoại', 'Laptop', 'Phụ kiện', 'Máy ảnh'];

//   const [products, setProducts] = useState<Product[]>([]);  // Thêm state cho products
//   const [error, setError] = useState('');
//   useEffect(() => {
//     const fetchProducts = async () => {
  
//       try {
  
//         const response = await axios.get('http://localhost:8080/api/products');
    
//         const productsWithImages = await Promise.all(response.data.map(async (product: Product) => {
//           try {
//             const imageResponse = await axios.get(
//               `http://localhost:8080/api/product/${product.id}/image`,
//               { responseType: "blob" }
//             );
//             const imageUrl = URL.createObjectURL(imageResponse.data);
//             return { ...product, imageUrl }; 
//           } catch (error) {
//             console.error("Error fetching image for product ID:", product.id, error);
//             return { ...product, imageUrl: "placeholder-image-url" };  
//           }
//         }));
    
//         setProducts(productsWithImages);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         setError('Error fetching products');
//       }
//     };
  
//     fetchProducts();
//   }, []);

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.menuButton}>
//           <Ionicons name="menu" size={30} color="white" />
//         </TouchableOpacity>
//         <View style={styles.searchBar}>
//           <TextInput style={styles.input} placeholder="Tìm kiếm sản phẩm..." placeholderTextColor="#888" />
//           <Ionicons name="search" size={25} color="white" style={styles.searchIcon} />
//           <TouchableOpacity 
//             style={styles.cartIcon}
//             onPress={() => navigation.navigate('cart')} // Thay đổi đây để điều hướng đến màn hình giỏ hàng
//           >
//             <Ionicons name="cart" size={25} color="white" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.categoryContainer}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
//           {categories.map((category, index) => (
//             <TouchableOpacity key={index} style={styles.categoryItem}>
//               <Text style={styles.categoryText}>{category}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.slider}>
//         <Image style={styles.sliderImage} source={require('@/assets/images/slider/slider01.png')} />
//         <Image style={styles.sliderImage} source={require('@/assets/images/slider/slider02.png')} />
//         <Image style={styles.sliderImage} source={require('@/assets/images/slider/slider03.png')} />
//       </ScrollView>

//       <View style={styles.productContainer}>
//         <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>
//         <View style={styles.underline} />
//         <FlatList
//           data={products}
//           numColumns={2}
//           keyExtractor={(item) => item.id.toString()} // Đảm bảo id là chuỗi
//           renderItem={({ item }) => (
//             <View style={styles.productItem}>
//               {/* Sử dụng URI để lấy hình ảnh */}
//               {item.imageUrl ? (
//           <Image
//             source={{ uri: item.imageUrl }}  
//             style={styles.productImage}
//             resizeMode="cover"
//           />
//         ) : (
//           <View style={styles.productImage} />
//         )}
//               <Text style={styles.productName}>{item.name}</Text> {/* Đổi từ title sang name */}
//               <Text style={styles.productPrice}>{item.price.toLocaleString()} VND</Text>
//               <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.buyButton}>
//                   <Text style={styles.buttonText}>Mua</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.detailsButton}
//                   onPress={() => navigation.navigate('ProductDetail', { product: item })} // Truyền sản phẩm vào đây
//                 >
//                   <Text style={styles.buttonText}>Chi tiết</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         />
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     marginVertical: 15,
//   },
//   slider: {
//     height: 250,
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginBottom: 20,
//   },
//   sliderImage: {
//     width: 450,
//     height: 250,
//     resizeMode: 'cover',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     marginHorizontal: 20,
//     marginVertical: 20,
//     alignItems: 'center',
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     height: 45,
//     borderRadius: 8,
//     paddingLeft: 15,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     elevation: 2,
//   },
//   categoryContainer: {
//     marginVertical: 5,
//     marginHorizontal: 7,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//     textAlign: 'center',
//   },
//   categories: {
//     flexDirection: 'row',
//   },
//   categoryItem: {
//     backgroundColor: '#FFD700',
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     marginRight: 10,
//     elevation: 1,
//   },
//   categoryText: {
//     fontSize: 16,
//     color: '#555',
//   },
//   productContainer: {
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   productItem: {
//     flex: 1,
//     margin: 10,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     padding: 15,
//     alignItems: 'center',
//     elevation: 3,
//   },
//   productImage: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   productName: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: '500',
//     textAlign: 'center',
//     color: '#333',
//   },
//   productPrice: {
//     marginTop: 5,
//     fontSize: 14,
//     color: '#28A745',
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     marginTop: 10,
//   },
//   buyButton: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//     marginRight: 10,
//   },
//   detailsButton: {
//     backgroundColor: '#FF8C00',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   header: {
//     backgroundColor: '#FF6347',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   menuButton: {
//     padding: 5,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FF6347',
//     paddingHorizontal: 30,
//     paddingVertical: 10,
//     marginLeft: -10,
//   },
//   searchIcon: {
//     marginRight: 10,
//     marginLeft: 5,
//   },
//   cartIcon: {
//     marginLeft: 5,
//   },
//   underline: {
//     width: '100%',
//     height: 2,
//     backgroundColor: '#000000',
//     marginBottom: 3,
//   },
// });