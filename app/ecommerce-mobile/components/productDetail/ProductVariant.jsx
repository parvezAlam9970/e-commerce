import { TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import { Text } from "../ui/text";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { Select, SelectBackdrop, SelectContent, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "../ui/select";

const ProductVariant = () => {
  const insets = useContext(SafeAreaInsetsContext);

  return (
    <SafeAreaView style={{ paddingTop: insets?.top || 0}}>
      <ColorSelect />
      {/* Removed gap-x-3 to avoid layout shifting */}
      <View className="flex mt-4 justify-between flex-row">
        <SelectSize />
        <SelectQuantity />
      </View>
    </SafeAreaView>
  );
};

export default ProductVariant;

function ColorSelect() {
  return (
    <View className="flex flex-row items-center gap-x-3 justify-start">
      <Text size="lg" className="text-medium">Color :</Text>
      <View className="flex flex-row gap-x-2">
        {[1, 2, 3, 4].map((elm, i) => (
          <View key={i} className="w-6 h-6 rounded-full bg-red-600"></View>
        ))}
      </View>
    </View>
  );
}

function SelectSize() {
  const [selectedSize, setSelectedSize] = useState("S");

  return (
    <View style={{ width: "48%" }}> 
      <Text size="lg" className="text-medium">Select Size</Text>
      <Select className="bg-[#F5F5F5] mt-2 border-none" selectedValue={selectedSize} onValueChange={(value) => setSelectedSize(value)}>
        <SelectTrigger>
          <SelectInput placeholder="Choose Size" className="pt-0 mt-2" />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            {["S", "M", "L", "XL"].map((size) => (
              <SelectItem key={size} label={size} value={size} />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>
  );
}

function SelectQuantity() {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <View style={{ width: "48%" }}> 
      <Text size="lg" className="text-medium">Quantity</Text>
      <View className="flex flex-row items-center bg-[#F5F5F5] mt-2  rounded-lg justify-between">
        <TouchableOpacity onPress={decreaseQuantity} className="px-3 py-2 bg-[#2B2B2B] rounded-md">
          <Text className="text-lg text-[#FF8765] font-bold">-</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold">{quantity}</Text>
        <TouchableOpacity onPress={increaseQuantity} className="px-3 py-2 bg-[#2B2B2B] rounded-md">
          <Text className="text-lg text-[#FF8765] font-bold">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
