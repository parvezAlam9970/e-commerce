import React from "react";
import { View, FlatList, Image, Dimensions } from "react-native";

const data = [
  {
    id: "1",
    image:
      "https://media.istockphoto.com/id/2161733236/photo/autumn-or-thanksgiving-decoration-background-with-pumkins-and-fall-leaves-copy-space.webp?a=1&b=1&s=612x612&w=0&k=20&c=6GpLbBGlqcroXSfAbvWwVN6T7Vg6-ucR3c_T3YOyFko=",
  },
  {
    id: "2",
    image:
      "https://media.istockphoto.com/id/2161733236/photo/autumn-or-thanksgiving-decoration-background-with-pumkins-and-fall-leaves-copy-space.webp?a=1&b=1&s=612x612&w=0&k=20&c=6GpLbBGlqcroXSfAbvWwVN6T7Vg6-ucR3c_T3YOyFko=",
  },
  {
    id: "3",
    image:
      "https://media.istockphoto.com/id/2161733236/photo/autumn-or-thanksgiving-decoration-background-with-pumkins-and-fall-leaves-copy-space.webp?a=1&b=1&s=612x612&w=0&k=20&c=6GpLbBGlqcroXSfAbvWwVN6T7Vg6-ucR3c_T3YOyFko=",
  },
];

const { width } = Dimensions.get("window");

const Carousel = () => {
  const renderItem = ({ item }) => (
    <View         className="rounded-[15px] w-[100vw] mx-auto "
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: "100%", height: 180, resizeMode: "cover" }}
        className="rounded-[15px]"
      />
    </View>
  );

  return (
    <FlatList
      data={data}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      snapToInterval={width} 
      snapToAlignment="start"
      decelerationRate="fast" 
     
    />
  );
};

export default Carousel;
