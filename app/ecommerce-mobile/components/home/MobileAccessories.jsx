import { FlatList, Image, TouchableOpacity, View } from "react-native";
import React from "react";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { useNavigation, useRouter } from "expo-router";

const DATA = [
  { id: "1", title: "Mobile Covers" },
  { id: "2", title: "Charging Cables" },
  { id: "3", title: "Charging Adapters" },
  { id: "4", title: "Head Phones" },
];

const Item = ({ item }) => (
  <View className=" mt-1 bg-[#F2F2F2] rounded-md flex-row p-[6px] items-center mx-2">
    <Text className="text-semibold" size="sm">
      {item?.title}
    </Text>
  </View>
);

const MobileAccessories = () => {
  return (
    <View>
      <HStack className="w-full flex items-center justify-between flex-row">
        <Text className="mt-8" bold size="lg">
          Mobile Accessories
        </Text>
      </HStack>
      <FlatList
        horizontal
        data={DATA}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
      />

      <FlatList
        horizontal
        data={DATA}
        renderItem={({ item }) => <Product item={item} />}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        className="mt-4"
      />
      <FlatList
        horizontal
        data={DATA}
        renderItem={({ item }) => <Product item={item} />}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        className="mt-4"
      />
    </View>
  );
};

export default MobileAccessories;

function Product({ item }) {
  const router = useRouter();
  const handlePress = () => {
    router.push("/noTabs/ProductDetail?productId=ProductName");
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="border-[1px] max-w-[120px] border-gray-200 p-2 px-3 rounded-sm">
        <View>
          <Image
            className="w-[100px] h-[120px]"
            source={{
              uri: item.imageUrl || "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/6/t/4/-original-imah3chxfkqxyzm3.jpeg?q=70",
            }}
          />
        </View>
        <Text size="sm" className="p-0 m-0">{item.name}</Text>
        <View className="flex flex-row gap-x-2">
          <Text size="sm" className="">{`$${item.price}`}</Text>
          <Text size="sm" className="line-through text-gray-400">{`$${item.originalPrice}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
