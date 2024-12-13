import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MenuIcon from "../../../assets/svg/menu.svg";
import tw from "twrnc";


const HomeHeader = ({ onMenuPress, onCartPress }) => {
  return (
    <View style={tw`flex-row items-center justify-between  bg-white shadow`}>
      {/* Menu Icon */}
      <TouchableOpacity onPress={onMenuPress} className="p-2">
        <MenuIcon style={tw`text-red-500`} />
      </TouchableOpacity>r

      {/* <Text className="text-lg font-bold text-black">Home</Text> */}

      
    </View>
  );
};

export default HomeHeader;
