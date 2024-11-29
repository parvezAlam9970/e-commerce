import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";

const LoginScreen = () => {
  const [phone, setPhone] = useState("");

  const handleLogin = () => {
    // Handle login logic here (e.g., API call)
    console.log("Phone Number:", phone);
  };
  return (
    <View style={tw`pt-6 mt-20 flex justify-center h-full items-center`}>
      {/* <Text  style={tw`font-bold text-[30px] `}>WELCOME To</Text> */}
      <Image
        style={tw`w-[250px] h-[250px]`}
        source={require("../../assets/logo.png")}
      />
      <View style={tw`flex-1  w-full px-[10%]`}>
      <Text style={[tw`text-2xl mb-5`, { fontFamily: 'Poppins-Bold' }]}>Login</Text>

        <TextInput
            style={tw`bg-[#F5F5F5] w-full px-4 py-5 rounded-lg mb-5`}
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => setPhone(text)}
          placeholderTextColor="#BFBFBF"  
          placeholderStyle={{ fontSize: 40, fontFamily: 'Poppins-bold' }} 
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={tw`bg-[#FF8765] w-full py-4 rounded-lg items-center`}
        >
          <Text style={[tw`text-white text-xl text-center` ,{ fontFamily: 'Poppins-Bold' }]}>Request OTP</Text>
        </TouchableOpacity>
       
      </View>

      {/* <StatusBar style="auto" /> */}
    </View>
  );
};

export default LoginScreen;
