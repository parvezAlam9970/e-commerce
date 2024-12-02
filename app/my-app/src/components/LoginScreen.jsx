import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("");

  const handleLogin = () => {
    navigation.navigate("OTPScreen");
  };
  return (
    <View style={tw`  flex justify-center h-full bg-white items-center`}>
      {/* <Text  style={tw`font-bold text-[30px] `}>WELCOME To</Text> */}
      <View
        style={tw`w-full h-full flex flex-col mt-40 justify-center items-center`}
      >
        <Image
          style={tw`w-[250px] h-[250px]`}
          source={require("../../assets/logo.png")}
        />
        <View style={tw`flex-1  w-full px-[10%]`}>
          <Text style={[tw`text-2xl mb-5`, { fontFamily: "Poppins-Bold" }]}>
            Login
          </Text>

          <TextInput
            style={tw`bg-[#F5F5F5] w-full px-4 py-4 rounded-lg mb-5`}
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            placeholderTextColor="#BFBFBF"
            placeholderStyle={{ fontSize: 30, fontFamily: "Poppins-bold" }}
          />

          <TouchableOpacity
            onPress={handleLogin}
            style={tw`bg-[#FF8765] w-full py-3 rounded-lg items-center`}
          >
            <Text
              style={[
                tw`text-white text-lg w-full text-center`,
                { fontFamily: "Poppins-semiBold" },
              ]}
            >
              Request OTP
            </Text>
          </TouchableOpacity>
          <Text style={tw`text-center text-[18px] mt-5`}>
            Create An Account?{" "}
            <Text onPress={() => navigation.navigate("SignUpScreen")} style={[tw`text-[#FF8765]`, { fontFamily: "Poppins-semiBold" }]}>
              Sign Up
            </Text>
          </Text>
        </View>
      </View>

      {/* <StatusBar style="auto" /> */}
    </View>
  );
};

export default LoginScreen;
