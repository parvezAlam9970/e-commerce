import React from "react";
import {
  View,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import { useForm } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { City, Country, State } from "../constants/constants";

const SignUp = ({navigation}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  let formData = watch();

  const onSubmit = (data) => {
    ToastAndroid.show("Sign-up successful!", ToastAndroid.SHORT);
    reset(); 
  };

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-grow px-5 py-5 bg-white`}>
      <Text style={[tw`text-2xl font-bold mb-4`, { fontFamily: "Poppins-Bold" }]}>
        Sign up
      </Text>

      <Text style={[tw`text-lg font-bold mb-2`, { fontFamily: "Poppins-Medium" }]}>
        Fill Your Personal Details
      </Text>

      {/* Name */}
      <TextInput
        placeholder="Name"
        style={tw`border border-gray-300 rounded-md px-3 py-3 mb-2`}
        {...register("name", { required: "Name is required" })}
      />
      {errors.name && showToast(errors.name.message)}

      {/* Mobile Number */}
      <TextInput
        placeholder="Mobile Number"
        keyboardType="numeric"
        style={tw`border border-gray-300 rounded-md px-3 py-3 mb-2`}
        {...register("mobile", {
          required: "Mobile number is required",
          pattern: {
            value: /^[0-9]{10}$/,
            message: "Enter a valid 10-digit mobile number",
          },
        })}
      />
      {errors.mobile && showToast(errors.mobile.message)}

      {/* Email */}
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        style={tw`border border-gray-300 rounded-md px-3 py-3 mb-2`}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Enter a valid email address",
          },
        })}
      />
      {errors.email && showToast(errors.email.message)}

      {/* Delivery Address */}
      <Text style={[tw`text-lg font-bold mt-4 mb-2`, { fontFamily: "Poppins-Medium" }]}>
        Delivery Address
      </Text>

      {/* Select Country */}
      <View>
        <View style={tw`border border-gray-300 rounded-md mb-2`}>
          <Picker
            selectedValue={formData.country}
            onValueChange={(itemValue) => setValue("country", itemValue)}
            style={tw`px-3 pb-10 h-[48px]`}
            itemStyle={{ height: 48 }}
          >
            <Picker.Item style={tw`text-[12px]`} label="Select Country" value="" />
            {Country?.map((country, index) => (
              <Picker.Item
                style={{ fontSize: 14, marginBottom: "10px" }}
                key={index}
                label={country}
                value={country}
              />
            ))}
          </Picker>
        </View>
        {errors.country && showToast(errors.country.message)}
      </View>

      {/* State */}
      <View>
        <View style={tw`border border-gray-300 rounded-md mb-2`}>
          <Picker
            selectedValue={formData.state}
            onValueChange={(itemValue) => setValue("state", itemValue)}
            style={tw`px-3 py-0 h-[48px]`}
            itemStyle={{ height: 50 }}
          >
            <Picker.Item style={tw`text-[12px]`} label="Select State" value="" />
            {State[formData.country]?.map((state, index) => (
              <Picker.Item
                style={{ fontSize: 14, margin: "0px" }}
                key={index}
                label={state}
                value={state}
              />
            ))}
          </Picker>
        </View>
        {errors.state && showToast(errors.state.message)}
      </View>

      {/* City */}
      <View>
        <View style={tw`border border-gray-300 rounded-md mb-2`}>
          <Picker
            selectedValue={formData.city}
            onValueChange={(itemValue) => setValue("city", itemValue)}
            style={tw`px-3 py-0 h-[48px]`}
            itemStyle={{ height: 50 }}
          >
            <Picker.Item style={tw`text-[12px]`} label="Select City" value="" />
            {City[formData.state]?.map((city, index) => (
              <Picker.Item
                style={{ fontSize: 14, margin: "0px" }}
                key={index}
                label={city}
                value={city}
              />
            ))}
          </Picker>
        </View>
        {errors.city && showToast(errors.city.message)}
      </View>

      {/* Pincode */}
      <TextInput
        placeholder="Pincode"
        keyboardType="numeric"
        style={tw`border border-gray-300 rounded-md px-3 py-3 mb-4`}
        {...register("pincode", {
          required: "Pincode is required",
          pattern: {
            value: /^[0-9]{6}$/,
            message: "Enter a valid 6-digit pincode",
          },
        })}
      />
      {errors.pincode && showToast(errors.pincode.message)}

      {/* Sign Up Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={tw`bg-[#FF8765] py-3 rounded-md`}
      >
        <Text
          style={[tw`text-white text-center text-lg`, { fontFamily: "Poppins-semiBold" }]}
        >
          Sign Up
        </Text>
      </TouchableOpacity>

      {/* Already have an account */}
      <Text style={tw`text-center mt-4`}>
        Already have an account?
        <Text
          onPress={() => navigation.navigate("LoginScreen")}
          style={[tw` text-sm text-[#FF8765] `, { fontFamily: "Poppins-semiBold" }]}
        >
          Login
        </Text>
      </Text>
    </ScrollView>
  );
};

export default SignUp;
