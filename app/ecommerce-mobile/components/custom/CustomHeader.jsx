import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ArrowLeft, ShoppingCart } from "lucide-react-native"; // Import icons
import { Text } from "@/components/ui/text"; // Import your custom Text component
import { useRouter } from "expo-router";

const CustomHeader = ({ title, onBackPress }) => {
  const router = useRouter()
  const onCartPress = () => {
    router.push("/screens/CartScreen")
  }
  return (
    <View className="flex flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      {/* Back Button */}
      <TouchableOpacity onPress={onBackPress} className="p-2">
        <ArrowLeft color="#000" size={24} />
      </TouchableOpacity>

      {/* Title */}
      <Text className="flex-1 text-center text-lg font-bold">{title}</Text>

      {/* Cart Icon */}
      <TouchableOpacity onPress={onCartPress} className="p-2">
        <ShoppingCart color="#000" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;