import { View, ScrollView,  TouchableOpacity, Image } from "react-native";
import React from "react";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";

const OrderScreen = () => {
  const router = useRouter()
  const orders = [
    {
      id: 1,
      deliveredBy: "16 Dec",
      productName: "Men's Slim fit Formal Trousers",
      price: "$49.99",
      imageUrl: "https://rukminim2.flixcart.com/image/192/240/xif0q/mobile/c/a/r/-original-imah2pgpfmeadck9.jpeg?q=60&crop=false", // Replace with your image URL
    },
    {
      id: 2,
      deliveredBy: "16 Dec",
      productName: "Men's Slim fit Formal Trousers",
      price: "$49.99",
      imageUrl: "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/6/t/4/-original-imah3chxfkqxyzm3.jpeg?q=70", // Replace with your image URL
    },
    {
      id: 3,
      deliveredBy: "16 Dec",
      productName: "Men's Slim fit Formal Trousers",
      price: "$49.99",
      imageUrl: "https://rukminim2.flixcart.com/image/192/240/xif0q/mobile/c/a/r/-original-imah2pgpfmeadck9.jpeg?q=60&crop=false", // Replace with your image URL
    },
    // Add more orders as needed
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="w-full p-4">
        {orders.map((order) => (
          <View key={order.id} className="mb-4 flex gap-y-5 flex-col border border-gray-100 p-4 bg-white shadow-lg rounded-lg">
            <View className="flex-row">
              <View className="max-w-[100px] h-full w-full object-contain max-h-[100px]">

              <Image
                source={{ uri: order.imageUrl }}
                className="w-full h-full"
              />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-sm ">Delivered By {order.deliveredBy}</Text>
                <Text size="xl" className=" font-semibold">{order.productName}</Text>
                <Text size="2xl" className=" font-bold mt-2">{order.price}</Text>
              </View>
            </View>
            <View className="flex-row justify-between gap-x-4 flex mt-4">
                <TouchableOpacity onPress={() => router.push("/screens/OrderHistory")} className="flex-1  border border-gray-200 rounded-lg">
                <Text size="lg" className=" font-semibold py-[8px] text-center">Order Details</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1  bg-[#2B2B2B] rounded-lg">
                <Text size="lg" className="text-[#FF8765] py-[8px] text-center">Track Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default OrderScreen;