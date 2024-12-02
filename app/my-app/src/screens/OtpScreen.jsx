import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import OtpTextInput from "react-native-otp-textinput";

const OtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(""); // Initialize `otp` as an empty string

  const handleVerifyOtp = () => {
    navigation.navigate("OTPScreen");
  };

  return (
    <View style={tw`flex justify-center items-center w-full h-full`}>
      <View>
        <Text
          style={[
            tw`text-2xl text-center mx-[15%] mb-5`,
            { fontFamily: "Poppins-Bold" },
          ]}
        >
          We have sent an OTP to your Mobile
        </Text>

        <Text
          style={[
            tw`text-xl text-center mx-[10%] mb-5`,
            { fontFamily: "Poppins-Medium" },
          ]}
        >
          Please check your mobile number 071*****12 to continue resetting your
          password
        </Text>

        <OtpTextInput
          handleTextChange={setOtp} // Handle text changes
          containerStyle={tw`flex-row justify-center`} // Style for container
          textInputStyle={tw`border bg-[#F5F5F5] rounded-[5px] border-gray-300 mx-2 w-[15%] text-center`} // Style for each input box
        />

        <View
          style={tw`w-full flex px-[10%] justify-center items-center flex-row `}
        >
          <TouchableOpacity
            onPress={handleVerifyOtp}
            style={tw`bg-[#FF8765] mt-10 w-full px-10 py-4 rounded-lg items-center`}
          >
            <Text
              style={[
                tw`text-white text-lg text-center`,
                { fontFamily: "Poppins-Bold" },
              ]}
            >
              Verify OTP
            </Text>
          </TouchableOpacity>
        </View>
          <Text style={tw`text-center text-xl mt-5`}>
          Didn't Receive? <Text style={[tw`text-[#FF8765]` ,{ fontFamily: 'Poppins-Bold' }]}>
          Click Here
          </Text>
          </Text>
      </View>
    </View>
  );
};

export default OtpScreen;
