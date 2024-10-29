// import { useCallback, useEffect, useState } from "react";
// import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import axios from "axios";

// const SearchItem = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filteredProducts, setFilteredProducts] = useState([]);

//     const route = useRoute();
//     const query = route.params?.query || ''; // Lấy query từ params

//     const formatCurrency = (value) => {
//         return numeral(value).format('0,0') + ' ₫';
//     };

//     const getProducts = useCallback(() => {
//         setLoading(true);
//         axios.get(`http://127.0.0.1:8000/api/productSearch?query=${query}`)
//             .then((result) => {
//                 setProducts(result.data);
//                 setLoading(false);
//             });
//     }, [query]);

//     useEffect(() => {
//         getProducts();
//     }, [getProducts]);

//     useEffect(() => {
//         const searchTerm = query.toLowerCase().trim().replace(/\s+/g, '');
//         const results = products.filter(item => {
//             const normalizedProductName = item.name.toLowerCase().replace(/\s+/g, '');
//             return normalizedProductName.includes(searchTerm);
//         });
//         setFilteredProducts(results);
//     }, [products, query]);

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Kết quả tìm kiếm cho: "{query}"</Text>
//             {filteredProducts.length > 0 ? (
//                 <FlatList
//                     data={filteredProducts}
//                     renderItem={({ item }) => (
//                         <View style={styles.card}>
//                             <Image
//                                 style={styles.image}
//                                 source={{ uri: `http://127.0.0.1:8000/img/${JSON.parse(item.photo)[0]}` }} // Đường dẫn đến ảnh
//                             />
//                             <Text style={styles.textName}>{item.name}</Text>
//                             <Text style={styles.textPrice}>Giá: {formatCurrency(item.price)}</Text>
//                         </View>
//                     )}
//                     keyExtractor={(item) => item.id.toString()}
//                     contentContainerStyle={styles.list}
//                 />
//             ) : (
//                 <Text>Không tìm thấy sản phẩm!</Text>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     card: {
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 10,
//         marginBottom: 16,
//         alignItems: 'center',
//         elevation: 3, // Chỉ áp dụng cho Android
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         shadowOffset: { width: 0, height: 1 },
//     },
//     image: {
//         width: '100%',
//         height: 150,
//         borderRadius: 10,
//         marginBottom: 8,
//     },
//     textName: {
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     textPrice: {
//         fontSize: 14,
//         color: '#888',
//     },
//     list: {
//         paddingBottom: 20,
//     },
// });

// export default SearchItem;
