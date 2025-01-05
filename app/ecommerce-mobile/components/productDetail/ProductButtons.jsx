import { View } from "react-native";
import React from "react";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { Icon } from "../ui/icon";
import { ShoppingCart } from "lucide-react-native";

const ProductButtons = () => {
  return (
    <View className="w-full my-4 ">
      <View className="flex flex-row w-full gap-x-5">
        <Button className="flex-1 h-[40px]">
          <Text size="lg" className="text-[#FF8765]">
            Buy Now
          </Text>
        </Button>
        <Button className="flex-1 h-[40px]">
          <View className="flex flex-row items-center gap-x-2">
          <Icon className="text-[#FF8765]" as={ShoppingCart} />

            <Text size="lg" className="text-[#FF8765] ">
              Add To Cart
            </Text>
          </View>
        </Button>
      </View>
    </View>
  );
};

export default ProductButtons;
