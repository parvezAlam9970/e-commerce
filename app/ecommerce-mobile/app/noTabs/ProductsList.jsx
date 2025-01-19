import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router"; // Import useRouter for navigation
import CustomHeader from "@/components/custom/CustomHeader";
import FiltersTab from "@/components/custom/FiltersTab";
import ProductCard from "@/components/custom/ProductCard";
import { RELATED_PRODUCTS } from "@/components/productDetail/RelatedProduct";

const ProductsList = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back(); 
  };

 

  return (
    <View className="flex-1 bg-white">
      <CustomHeader
        title="Products" 
        onBackPress={handleBackPress} 
      />

      <ScrollView className="w-full p-4">
        <FiltersTab/>
        <View className="flex mt-5 flex-row flex-wrap justify-between">
          {RELATED_PRODUCTS?.map((item) => (
            <View key={item.id} className="w-[48%] mb-4">
              <ProductCard item={item} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductsList;