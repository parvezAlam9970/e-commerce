import { useRouter } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text } from '../ui/text';

const ProductCard = ({ item }) => {
  const router = useRouter();
  const handlePress = () => {
    router.push("/noTabs/ProductDetail?productId=Men Slim");
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="rounded-sm">
        <View className="bg-[#D2D2D2] flex flex-col justify-center items-center rounded-lg p-2 aspect-square">
          <Image
            className="w-full h-full rounded-lg"
            source={{
              uri:
                item.imageUrl ||
                "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/6/t/4/-original-imah3chxfkqxyzm3.jpeg?q=70",
            }}
            resizeMode="contain"
          />
        </View>

        <Text size="md" className="mt-3" numberOfLines={1}>
          {item.name}
        </Text>
        <View className="flex flex-row gap-x-2">
          <Text size="md" className="">
            ${item.price}
          </Text>
          <Text size="md" className="line-through text-gray-400">
            ${item.originalPrice}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;