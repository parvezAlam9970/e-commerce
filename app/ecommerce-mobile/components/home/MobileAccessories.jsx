import { FlatList, Image, TouchableOpacity, View, Dimensions } from "react-native";
import React from "react";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { useNavigation, useRouter } from "expo-router";
import ProductCard from "../custom/ProductCard";

// Dummy data
const DATA = [
  { id: "1", title: "Mobile Covers" },
  { id: "2", title: "Charging Cables" },
  { id: "3", title: "Charging Adapters" },
  { id: "4", title: "Head Phones" },
];

const ProductDATA = [
  { 
    id: "1", 
    title: "Mobile Covers", 
    // imageUrl: "https://example.com/mobile-cover.jpg", 
    name: "Sleek Mobile Cover", 
    price: 15.99, 
    originalPrice: 20.99 
  },
  { 
    id: "2", 
    title: "Charging Cables", 
    // imageUrl: "https://example.com/charging-cable.jpg", 
    name: "Durable Charging Cable", 
    price: 9.99, 
    originalPrice: 12.99 
  },
  { 
    id: "3", 
    title: "Charging Adapters", 
    // imageUrl: "https://example.com/charging-adapter.jpg", 
    name: "Fast Charging Adapter", 
    price: 19.99, 
    originalPrice: 24.99 
  },
  { 
    id: "4", 
    title: "Head Phones", 
    // imageUrl: "https://example.com/headphones.jpg", 
    name: "Noise Cancelling Headphones", 
    price: 49.99, 
    originalPrice: 59.99 
  },
];

const Item = ({ item }) => (
  <View className="mt-1 bg-[#F2F2F2] rounded-md flex-row p-[6px] items-center mx-2">
    <Text className="text-semibold" size="md">
      {item?.title}
    </Text>
  </View>
);

const MobileAccessories = () => {
  const screenWidth = Dimensions.get("window").width; // Get screen width
  const cardWidth = screenWidth / 2.5; // Calculate card width for 2.5 cards

  return (
    <View>
      <HStack className="w-full flex items-center justify-between flex-row">
        <Text className="mt-8 mb-2" bold size="lg">
          Mobile Accessories
        </Text>
      </HStack>

      {/* Horizontal List for Categories */}
      <FlatList
        horizontal
        data={DATA}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
      />

      {/* Horizontal List for Products (2.5 cards visible) */}
      <View className="mt-4">
        <FlatList
          horizontal
          data={ProductDATA}
          renderItem={({ item }) => (
            <View style={{ width: cardWidth }}>
              <ProductCard item={item} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>

      {/* Repeat for another row (if needed) */}
      <View className="mt-4">
        <FlatList
          horizontal
          data={ProductDATA}
          renderItem={({ item }) => (
            <View style={{ width: cardWidth }}>
              <ProductCard item={item} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>
    </View>
  );
};

export default MobileAccessories;