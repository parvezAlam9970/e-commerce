import React from 'react'
import { Text, TouchableOpacity, View } from "react-native";
import HomeHeader from '../../components/home/HomeHeader';


const HomeScreen = () => {
    const handleMenuPress = () => {
        console.log("Menu icon pressed");
        // Add logic to open the menu or drawer
      };
    
      const handleCartPress = () => {
        console.log("Cart icon pressed");
        // Add logic to navigate to the cart screen
      };
  return (
    <View>
      <HomeHeader onMenuPress={handleMenuPress} onCartPress={handleCartPress} />
      </View>
  )
}

export default HomeScreen