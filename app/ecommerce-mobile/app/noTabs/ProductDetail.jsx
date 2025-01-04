import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import ProductImages from "@/components/productDetail/ProductImages";
import ProductDescription from "@/components/productDetail/ProductDescription";
import Divider from "@/components/custom/Divider";
import ProductVariant from "@/components/productDetail/ProductVariant";
import ProductButtons from "@/components/productDetail/ProductButtons";

const ProductDetail = () => {
  const { productId } = useLocalSearchParams(); // Correct way to get search params

  return (
    <SafeAreaProvider>
      <ProductImages />
      {/* Ensuring ScrollView and its children take full width */}
      <ScrollView className="bg-white w-full">
        <View className="px-4 w-full">  
          <ProductDescription />
          <Divider className="my-5" />
          <ProductVariant />
          <Divider className="my-5" />
          <ProductButtons className="w-full" />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default ProductDetail;
