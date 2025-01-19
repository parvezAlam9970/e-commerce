import { View, ScrollView } from 'react-native';
import React from 'react';
import { Text } from '../ui/text';
import ProductCard from '../custom/ProductCard';

// Dummy data for related products
export const RELATED_PRODUCTS = [
  {
    id: '1',
    name: 'Sleek Mobile Cover',
    price: 15.99,
    originalPrice: 20.99,
    // imageUrl: 'https://example.com/mobile-cover.jpg',
  },
  {
    id: '2',
    name: 'Durable Charging Cable',
    price: 9.99,
    originalPrice: 12.99,
    // imageUrl: 'https://example.com/charging-cable.jpg',
  },
  {
    id: '3',
    name: 'Fast Charging Adapter',
    price: 19.99,
    originalPrice: 24.99,
    // imageUrl: 'https://example.com/charging-adapter.jpg',
  },
  {
    id: '4',
    name: 'Noise Cancelling Headphones',
    price: 49.99,
    originalPrice: 59.99,
    // imageUrl: 'https://example.com/headphones.jpg',
  },
  {
    id: '5',
    name: 'Fast Charging Adapter',
    price: 19.99,
    originalPrice: 24.99,
    // imageUrl: 'https://example.com/charging-adapter.jpg',
  },
  {
    id: '6',
    name: 'Noise Cancelling Headphones',
    price: 49.99,
    originalPrice: 59.99,
    // imageUrl: 'https://example.com/headphones.jpg',
  },
];

const RelatedProduct = () => {
  return (
    <View className="px-2">
      <Text className="my-3 text-lg font-bold">Related Product</Text>
      <ScrollView>
        <View className="flex flex-row flex-wrap justify-between">
          {RELATED_PRODUCTS.map((item) => (
            <View key={item.id} className="w-[48%] mb-4">
              <ProductCard item={item} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default RelatedProduct;