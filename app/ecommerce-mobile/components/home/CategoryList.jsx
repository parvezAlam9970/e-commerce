import { FlatList, Image, View, StyleSheet } from "react-native";
import React from "react";
import { Text } from "../ui/text";
import { ChevronRight } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { HStack } from "../ui/hstack";

const DATA = [
  { id: "1", title: "First Item" },
  { id: "2", title: "Second Item" },
  { id: "3", title: "Third Item" },
  { id: "4", title: "Fourth Item" },
  { id: "5", title: "Fifth Item" },
  { id: "6", title: "Sixth Item" },
];

const Item = ({ item }) => (
  <View className="flex items-center mx-2">
    <View
      style={styles.shadow_box}
      className=" rounded-md bg-white  w-[70px] p-2 h-[70px]"
    >
      <Image
        className="w-full h-full"
        source={{
          uri: "https://rukminim2.flixcart.com/flap/96/96/image/22fddf3c7da4c4f4.png?q=100",
        }}
      />
    </View>
    <Text className="text-[#ff8765] mt-2" size="sm" bold>
      {item?.title}
    </Text>
  </View>
);

const CategoryList = () => {
  return (
    <View>
      <HStack className="w-full flex items-center mt-20 justify-between flex-row">
        <Text className="mt-8" bold size="lg">
          Top Categories
        </Text>
        <Text className="mt-8 flex flex-row items-center" bold size="sm">
          View All
          <Icon as={ChevronRight} className="text-black w-5 h-5 ml-3" />
        </Text>
      </HStack>
      <FlatList
        horizontal
        data={DATA}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        className="mt-4"
      />
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  shadow_box: {
    shadowColor: "rgba(67, 71, 85, 0.9)", // Shadow color
    // shadowOffset: { width: 0, height: 2 }, // Offset for iOS
    shadowOpacity: 0.5, // Opacity for iOS
    shadowRadius: 4, // Blur radius for iOS
    elevation: 3, // Elevation for Android
    borderRadius: 8, // Rounded corners for consistency
  },
});
