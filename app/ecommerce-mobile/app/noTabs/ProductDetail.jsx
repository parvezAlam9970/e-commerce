import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import ProductImages from "@/components/productDetail/ProductImages";

const ProductDetail = () => {
  const { productId } = useLocalSearchParams(); // Correct way to get search params

  return (
    <SafeAreaProvider>
      <ScrollView className="bg-white  px-4">
<ProductImages/>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default ProductDetail;
