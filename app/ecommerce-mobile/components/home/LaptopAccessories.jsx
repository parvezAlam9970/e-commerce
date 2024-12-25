import { Image, View } from "react-native";
import React from "react";
import { Text } from "../ui/text";
import { HStack } from "../ui/hstack";
import { FlatList } from "react-native";

const DATA = [
  { id: "1", title: "Laptop Skins" },
  { id: "5", title: "Laptop Bags" },
  { id: "2", title: "USB Cables" },
  { id: "3", title: "Charging Adapters" },
  { id: "4", title: "Laptop Speakers" },
];

const Item = ({ item }) => (
  <View className=" mt-1 bg-[#F2F2F2] rounded-md flex-row p-[6px] items-center mx-2">
    <Text className="text-semibold" size="sm">
      {item?.title}
    </Text>
  </View>
);

const LaptopAccessories = () => {
  return (
    <View>
      <HStack className="w-full flex items-center justify-between flex-row">
        <Text className="mt-8" bold size="lg">
          Laptop Accessories
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
        renderItem={({ item }) => <CategoryCard item={item} />}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        className="mt-4"
      />
    </View>
  );
};

export default LaptopAccessories;

function CategoryCard({ item }) {
  return (
    <View>
      <View className=" rounded-lg">
        <View className=" rounded-md bg-[#F2F2F2]  w-[150px] p-2 h-[150px]">
          <Image
            className="w-full h-full"
            source={{
              uri: "https://rukminim2.flixcart.com/flap/96/96/image/22fddf3c7da4c4f4.png?q=100",
            }}
          />
        </View>
      </View>
      <Text size="md">USB Cables</Text>
    </View>
  );
}
