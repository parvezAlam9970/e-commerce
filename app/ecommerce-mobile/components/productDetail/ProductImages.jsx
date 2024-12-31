import { View, Image } from "react-native";
import React from "react";

const ProductImages = () => {
  return (
    <View className="h-[250px] p-2 bg-[#F5F5F5]">
      <Image
        className="w-full h-full"
        source={{
          uri: "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/6/t/4/-original-imah3chxfkqxyzm3.jpeg?q=70",
        }}
        style={{ resizeMode: "contain" }} // Add resizeMode with contain
      />
    </View>
  );
};

export default ProductImages;
