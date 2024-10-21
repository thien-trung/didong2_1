import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView } from 'react-native';

// Khai báo interface cho sản phẩm trong giỏ hàng
interface CartItem {
  id: string;      // Hoặc number nếu id là dạng số
  name: string;
  price: number;
  quantity: number;
  image: any;
  selected: boolean; // Thêm thuộc tính selected
}

export default function CartScreen() {
  // Khởi tạo state cho giỏ hàng
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'iPhone 14', price: 29990000, quantity: 1, image: require('@/assets/images/products/product03.png'), selected: false },
    { id: '2', name: 'MacBook Pro', price: 49990000, quantity: 1, image: require('@/assets/images/products/product01.png'), selected: false },
    { id: '3', name: 'AirPods Pro', price: 6990000, quantity: 1, image: require('@/assets/images/products/product02.png'), selected: false },
  ]);

  // Tăng số lượng sản phẩm
  const increaseQuantity = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Giảm số lượng sản phẩm
  const decreaseQuantity = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Tính tổng tiền cho các sản phẩm đã chọn
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.selected) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  // Toggle chọn sản phẩm
  const toggleSelectItem = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

const renderItem = ({ item }: { item: CartItem }) => (
  <View style={styles.cartItem}>
    <Image style={styles.productImage} source={item.image} />
    <View style={styles.productDetails}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} VND</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Text style={styles.removeButton}>Xóa</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={() => toggleSelectItem(item.id)} style={styles.checkboxContainer}>
      <Text style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
        {item.selected ? '✓' : ' '}
      </Text>
    </TouchableOpacity>
  </View>
);
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput style={styles.input} placeholder="Tìm kiếm sản phẩm..." placeholderTextColor="#888" />
          <Ionicons name="search" size={25} color="white" style={styles.searchIcon} />
          <TouchableOpacity style={styles.cartIcon}>
            <Ionicons name="cart" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.slider}>
        <Image style={styles.sliderImage} source={require('@/assets/images/slider/slider01.png')} />
        <Image style={styles.sliderImage} source={require('@/assets/images/slider/slider02.png')} />
        <Image style={styles.sliderImage} source={require('@/assets/images/slider/slider03.png')} />
      </ScrollView>
      <Text style={styles.sectionTitle}>Giỏ Hàng</Text>
      <View style={styles.underline} />


      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng tiền: {calculateTotal().toLocaleString()} VND</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.buttonText}>Thanh Toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginVertical: 15,
  },
 
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
 
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    fontSize: 18,
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
  },
  removeButton: {
    marginTop: 10,
    color: 'red',
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
  input: {
    flex: 1,
    paddingLeft: 10,
    color: 'black',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    height: 40,
  },
  slider: {
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  sliderImage: {
    width: 450,
    height: 250,
    resizeMode: 'cover',
  },
  sectionTitle: {
    marginHorizontal: 15,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign:'center',
    
  },
  totalContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    elevation: 3,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 8,
    justifyContent: 'space-between', // Thay đổi để căn giữa các phần
    alignItems: 'center', // Căn chỉnh giữa theo chiều dọc
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007BFF',
  },
  selectText: {
    fontSize: 16,
  },
  underline: {
    width: '100%',
    height: 2,
    backgroundColor: '#000000',
    marginBottom: 3,
  },
});
