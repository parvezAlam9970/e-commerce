import { View } from "react-native";
import React from "react";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

const ProductButtons = () => {
  return (
    <View className="w-full ">
      <View className="flex flex-row w-full gap-2">
        <Button className="flex-1 py-2">
          <Text size="lg">Buy Now</Text>
        </Button>
        <Button className="flex-1 py-2">

        <Text size="lg">Add To Cart</Text>
        </Button>
      </View>
    </View>
  );
};

export default ProductButtons;
