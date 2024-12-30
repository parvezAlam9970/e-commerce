import { View, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Text } from "@/components/ui/text";

const mainCategories = [
  {
    id: 1,
    name: "Mobiles",
    image:
      "https://rukminim2.flixcart.com/flap/80/80/image/22fddf3c7da4c4f4.png?q=100",
  },
  {
    id: 2,
    name: "Fashion",
    image:
      "https://rukminim2.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png?q=100",
  },
  {
    id: 3,
    name: "Electronics",
    image:
      "https://rukminim2.flixcart.com/flap/80/80/image/69c6589653afdb9a.png?q=100",
  },
  {
    id: 4,
    name: "Home Appliances",
    image:
      "https://rukminim2.flixcart.com/fk-p-flap/80/80/image/0139228b2f7eb413.jpg?q=100",
  },
  {
    id: 5,
    name: "Toys",
    image:
      "https://rukminim2.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png?q=100",
  },
];

const subCategories = {
  1: [
    "Mobiles",
    "Laptops",
    "Cameras",
    "Men's Wear",
    "Women's Wear",
    "Accessories",
  ],
  2: ["Men's Wear", "Women's Wear", "Accessories"],
  3: ["Refrigerators", "Microwaves", "Washing Machines"],
  4: ["Fiction", "Non-Fiction", "Educational"],
  5: ["Action Figures", "Dolls", "Puzzles"],
};

const CategoryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(mainCategories?.[0]?.id);

  return (
    <View className="flex-1 flex-row bg-white">
      <View className="w-1/4 bg-gray-100">
        <FlatList
          data={mainCategories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`flex flex-col items-center  py-1 border-b border-gray-300 ${
                selectedCategory === item.id ? "bg-[#FF8765]" : ""
              }`}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Image
                source={{ uri: item.image }}
                className="w-12 h-12 mr-4 rounded"
              />
              <Text
                size="sm"
                className={` text-center ${
                  selectedCategory === item.id
                    ? "text-white font-bold"
                    : "text-black"
                }`}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View className="w-2/3 p-4 ">
        <Text size="xl" bold className=" my-2 border-b border-gray-200">
          Mobiles
        </Text>

        <View className="flex flex-wrap justify-between flex-row">
          {subCategories[selectedCategory]?.map((sub, index) => (
            <View className="">
              <Image
                source={{
                  uri: "https://rukminim2.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png?q=100",
                }}
                className="w-20 h-20 mr-4 rounded-full bg-slate-200"
              />

              <Text
                key={index}
                size="sm"
                className=" text-center my-2 text-gray-700"
              >
                {sub}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default CategoryScreen;
