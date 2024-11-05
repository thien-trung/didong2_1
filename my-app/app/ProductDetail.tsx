import React, { ReactNode, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Định nghĩa kiểu cho sản phẩm và các tham số truyền vào màn hình chi tiết sản phẩm
type Product = {
  id: string;
  description: ReactNode;
  name: string;
  price: number;
  photo: any;  
};

type ProductDetailScreenRouteProp = RouteProp<{ params: { product: Product } }, 'params'>;

// Định nghĩa kiểu cho sản phẩm liên quan
type RelatedProduct = {
  id: string;
  name: string;
  price: string;
  image: any;  
  description: string;
};

const relatedProducts: RelatedProduct[] = [
  { 
    id: '1', 
    name: 'iPhone 14', 
    price: '29,990,000 VND', 
    image: require('@/assets/images/products/3.png'),
    description: 'iPhone 14 với hiệu suất mạnh mẽ và camera chất lượng cao.' 
  },

  { 
    id: '2', 
    name: 'MacBook Pro', 
    price: '49,990,000 VND', 
    image: require('@/assets/images/products/1.png'),
    description: 'MacBook Pro, máy tính xách tay cao cấp với hiệu suất vượt trội.' 
    
  },
  { 
    id: '3', 
    name: 'AirPods Pro', 
    price: '6,990,000 VND', 
    image: require('@/assets/images/products/2.png'),
    description: 'AirPods Pro với khả năng khử tiếng ồn và âm thanh sống động.' 
    
  },
  { 
    id: '4', 
    name: 'Canon Camera', 
    price: '12,990,000 VND', 
    image: require('@/assets/images/products/4.png'),
    description: 'Canon Camera, máy ảnh chất lượng cao cho những người yêu thích nhiếp ảnh.' 
    
  },
];


const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { product } = route.params;  

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const renderRelatedProduct = ({ item }: { item: RelatedProduct }) => (
    <TouchableOpacity style={styles.relatedProductContainer} >
      <Image source={item.image} style={styles.relatedProductImage}/>
      <Text style={styles.relatedProductName}>{item.name}</Text>
      <Text style={styles.relatedProductPrice}>{item.price}</Text>

    </TouchableOpacity>
  );
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
    const handleRegisterPress = () => {
        router.push('/home');
      };
  return (
    
    <ScrollView style={styles.container}>
          <TouchableOpacity style={styles.back} onPress={handleRegisterPress}>
            <Ionicons name="arrow-back" size={35} color="black" />
          </TouchableOpacity>
          <Image style={styles.productImage} source={{ uri: `http://127.0.0.1:8000/storage/products/${product.photo}` }} />
          <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>{product.price}</Text>

      <View style={styles.quantitySelector}>
        <TouchableOpacity style={styles.button} onPress={decreaseQuantity}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity style={styles.button} onPress={increaseQuantity}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.orderButton}  onPress={() => addToCart(product.id, 1, product.price)} >
        <Text  style={styles.orderButtonText}>Thêm vào giỏ hàng
        </Text>
      </TouchableOpacity>
      <Text style={styles.descriptionTitle}>Mô tả:</Text>
      <Text style={styles.descriptionText}>{product.description}</Text>
      <Text style={styles.relatedProductsTitle}>Sản phẩm liên quan</Text>
      <FlatList
        data={relatedProducts}
        renderItem={renderRelatedProduct}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: width - 40, // Đặt chiều rộng của hình ảnh
    height: 250, // Đặt chiều cao của hình ảnh
    borderRadius: 15,
    resizeMode: 'contain', // Thay đổi từ 'cover' thành 'contain' để giữ tỷ lệ hình ảnh
    alignSelf: 'center',
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: '#333',
  },
  
  productPrice: {
    fontSize: 20,
    color: '#E63946',
    textAlign: 'center',
    marginBottom: 15,
  },
  quantitySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  quantityText: {
    width: 60,
    textAlign: 'center',
    fontSize: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  button: {
    width: 40,
    alignItems: 'center',
    backgroundColor: '#F1C40F',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
  orderButton: {
    backgroundColor: '#E63946',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 5,
    marginVertical: 20,
    alignSelf: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  descriptionTitle: {
    fontSize: 18,
    marginVertical: 10,
    paddingHorizontal: 20,
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: 'justify',
    color: '#555',
  },
  relatedProductsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingHorizontal: 20,
    color: '#333',
  },
  relatedProductContainer: {
    marginRight: 15,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  relatedProductImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  relatedProductName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  relatedProductPrice: {
    fontSize: 12,
    color: '#E63946',
  },
  back:{
    padding: 5,
    marginTop:10,
    marginLeft:-10,
  },
  icon: {
  },

});

export default ProductDetailScreen;
