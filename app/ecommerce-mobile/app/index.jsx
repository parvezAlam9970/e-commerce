import { Button, ButtonText } from "@/components/ui/button";
import React from "react";
import { Text, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "react-native";
import { Menu, Search, ShoppingCart } from "lucide-react-native";
import { Strong } from "@expo/html-elements";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";

const HomeScreen = () => {
  return (
    <View className="bg-white ">
      <View className="bg-[#FF8765] p-4 rounded-b-[20px] h-[250px]">
        <View className="flex justify-between flex-row w-full">
          <Pressable className="flex-row flex gap-2">
            <Icon as={Menu} className="text-white text-[20px] w-8 h-8" />
          </Pressable>

          <Pressable className="flex-row gap-2">
            <Icon
              as={ShoppingCart}
              className="text-white fill-white text-[20px] w-8 h-8"
            />
          </Pressable>
        </View>
        <View className="flex my-4 justify-between flex-row">
          <Heading size="lg" className="text-white font-normal ">
            Good Morning <Strong>Suraj</Strong>
          </Heading>

          <Heading size="md" className="text-white">
            23 Dec 2024
          </Heading>
        </View>
        <Input
          size="md"
          className="h-[45px] text-white  outline-white rounded-lg bg-[#FF9F84] border-none"
        >
          <Icon as={Search} className="text-white w-5 h-5 ml-3" />

          <InputField
            placeholder="Search Your Product "
            className="text-white border-none"
          />
        </Input>
      </View>
    </View>
  );
};

export default HomeScreen;
