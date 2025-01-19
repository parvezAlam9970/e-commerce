import { useRouter } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text } from '../ui/text';

const ProductCard = ({ item }) => {
  const router = useRouter();
  const handlePress = () => {
    router.push("/screens/ProductDetail?productId=Men Slim");
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="rounded-sm mb-4">
        <View className="bg-gray-100 flex flex-col justify-center items-center rounded-lg p-2  h-[200px]">
          <Image
            className="w-full h-[150px] p-5 "
            source={{
              uri:
                item.imageUrl ||
                "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/6/t/4/-original-imah3chxfkqxyzm3.jpeg?q=70",
            }}
            resizeMode="contain"
          />
        </View>

        <Text size="lg" className="mt-3 font-medium" numberOfLines={1}>
          {item.name}
        </Text>
        <View className="flex flex-row gap-x-2">
          <Text size="lg" className=" font-semibold">
            ${item.price}
          </Text>
          <Text size="lg" className="line-through text-gray-400">
            ${item.originalPrice}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;