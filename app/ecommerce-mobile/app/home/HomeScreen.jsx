import { Button, ButtonText } from "@/components/ui/button";
import React from "react";
import { Text, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "react-native";
import { Menu, Search, ShoppingCart } from "lucide-react-native";
import { Strong } from "@expo/html-elements";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import Carousel from "@/components/home/Carousel";
import CategoryList from "@/components/home/CategoryList";
import MobileAccessories from "@/components/home/MobileAccessories";
import { ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LaptopAccessories from "@/components/home/LaptopAccessories";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router =  useRouter()
  return (
    <SafeAreaProvider>

    <ScrollView className="bg-white "
    contentContainerStyle={{ flexGrow: 1 }} // Ensures scrolling works properly

    
    >
      <View className="bg-[#FF8765] relative p-4 rounded-b-[20px] h-[250px]">
        <View className="flex justify-between flex-row w-full">
          <Pressable className="flex-row flex gap-2" >
            <Icon as={Menu} className="text-white text-[20px] w-8 h-8" />
          </Pressable>

          <Pressable className="flex-row gap-2" onPress={() => router.push("/screens/CartScreen") }>
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
        <View className="mt-4 mx-auto w-full">
          <Carousel />
        </View>
        

      </View>
      <View className="p-4">

      <CategoryList/>
        <MobileAccessories/>
        <LaptopAccessories/>
      </View>
    </ScrollView>
</SafeAreaProvider>


  );
};

export default HomeScreen;
