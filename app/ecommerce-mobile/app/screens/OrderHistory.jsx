import { View, ScrollView } from "react-native";
import React from "react";
import CustomHeader from "@/components/custom/CustomHeader";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";

const OrderHistory = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <ScrollView className="bg-white w-full">
      <CustomHeader title={"Order History"} onBackPress={handleBackPress} />
      <View className="p-4">
        <Text size="lg" className="font-bold">Order #20156</Text>
        <Text size="sm" className="text-gray-600">Time: 12:00 pm | 12 Oct 2022</Text>

        <Text size="lg" className="font-bold mt-4">Delivery Address</Text>
        <Text size="sm" className="text-gray-600">
          Suraj Panther
          {"\n"}18 Vaishali, Near Kohat Enclave, Pitampura,
          {"\n"}New Delhi-110034
          {"\n"}+919310003579
        </Text>
      </View>
    </ScrollView>
  );
};

export default OrderHistory;