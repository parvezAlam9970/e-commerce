import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const ProductList = () => {
  return (
    <SafeAreaProvider>
      <ScrollView
        className="bg-white "
        contentContainerStyle={{ flexGrow: 1 }} // Ensures scrolling works properly
      >
        <View>
          <Text>ProductList</Text>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default ProductList;
