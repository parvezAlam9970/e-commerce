import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import ProductImages from "@/components/productDetail/ProductImages";
import ProductDescription from "@/components/productDetail/ProductDescription";
import Divider from "@/components/custom/Divider";
import ProductVariant from "@/components/productDetail/ProductVariant";
import ProductButtons from "@/components/productDetail/ProductButtons";
import { Text } from "@/components/ui/text";
import RelatedProduct from "@/components/productDetail/RelatedProduct";
import CustomHeader from "@/components/custom/CustomHeader";

const ProductDetail = () => {
  const router = useRouter();
  
    const handleBackPress = () => {
      router.back(); 
    };
  
  const { productId } = useLocalSearchParams(); 
  return (
      <ScrollView className="bg-white w-full">
         <CustomHeader
        title={productId}
        onBackPress={handleBackPress} 
      />
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
  );
};

export default ProductDetail;
