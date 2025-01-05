import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import ProductImages from "@/components/productDetail/ProductImages";
import ProductDescription from "@/components/productDetail/ProductDescription";
import Divider from "@/components/custom/Divider";
import ProductVariant from "@/components/productDetail/ProductVariant";
import ProductButtons from "@/components/productDetail/ProductButtons";
import { Text } from "@/components/ui/text";
import RelatedProduct from "@/components/productDetail/RelatedProduct";

const ProductDetail = () => {
  const { productId } = useLocalSearchParams(); // Correct way to get search params
console.log(productId , " pppppppp")
  return (
    <SafeAreaProvider>
      <ScrollView className="bg-white w-full">
      <ProductImages />
        <View className="px-4 w-full">  
          <ProductDescription />
          <Divider className="my-5" />
          <ProductVariant />
          <Divider className="my-5" />
          <ProductButtons className="w-full" />
          <View className="mb-10">
            <Text size="lg">
              Product Description
            </Text>
           
          </View>
          <RelatedProduct/>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default ProductDetail;
