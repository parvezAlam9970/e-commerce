import React, { useState } from "react";
import { View, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const images = [
  {
    id: "1",
    uri: "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/6/t/4/-original-imah3chxfkqxyzm3.jpeg?q=70",
  },
  {
    id: "2",
    uri: "https://rukminim2.flixcart.com/image/192/240/xif0q/mobile/l/x/c/-original-imagx6rdpmhuq5ba.jpeg?q=60&crop=false",
  },
  {
    id: "3",
    uri: "https://rukminim2.flixcart.com/image/192/240/xif0q/mobile/c/a/r/-original-imah2pgpfmeadck9.jpeg?q=60&crop=false",
  },
  {
    id: "4",
    uri: "https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/6/t/4/-original-imah3chxfkqxyzm3.jpeg?q=70",
  },
];

const ProductImages = () => {
  const [selectedImage, setSelectedImage] = useState(images[0].uri);

  return (
    <View className="bg-white">
      {/* Main Image Display */}
      <View className="h-[250px] p-3 bg-[#D2D2D2] items-center justify-center">
        <Image
          source={{ uri: selectedImage }}
          className="w-full h-full mt-2"
          style={{ resizeMode: "contain" }}
        />
      </View>

      {/* Thumbnail ScrollView */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="my-5 ">
        {images.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => setSelectedImage(item.uri)}>
            <Image
              source={{ uri: item.uri }}
              className={`w-[60px] h-[60px] object-cover mx-3 rounded-md ${
                selectedImage === item.uri ? "border-2 border-black" : "border-0"
              }`}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ProductImages;
