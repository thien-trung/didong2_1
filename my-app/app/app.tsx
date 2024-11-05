import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import Home from './home';
import CategoryProducts from './CategoryProducts';
import Cart from './cart';
import SearchResultsScreen from './SearchResultsScreen';
import Checkout from './Checkout';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="SearchResultsScreen" component={SearchResultsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CategoryProducts" component={CategoryProducts} options={{ headerShown: false }} />
        <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} /> */}
      </Stack.Navigator>
      <Toast /> 
    </NavigationContainer>
  );
}
