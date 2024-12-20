import { Text } from "@/components/ui/text";
import React from "react";
import { View } from "react-native";
import { FormControl } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Link } from "expo-router";

const SignUpScreen = () => {
  return (
    <FormControl className="border p-10 bg-white h-full flex rounded-lg border-outline-300">
      <VStack space="xl">
        <Heading size="lg" bold className="">
          Fill Yours Personal Details
        </Heading>
        <Input className="min-w-[250px] h-[40px]">
          <InputField placeholder="Enter Name" type="text" />
        </Input>
        <Input className="min-w-[250px] h-[40px]">
          <InputField placeholder="Enter Mobile Number" type="text" />
        </Input>
        <Input className="min-w-[250px] h-[40px]">
          <InputField placeholder="Enter Email" type="text" />
        </Input>
        <Heading size="lg" bold className="">
          Delivery Address
        </Heading>
        <Input className="min-w-[250px] h-[40px]">
          <InputField placeholder="Enter Address" type="text" />
        </Input>
        <Input className="min-w-[250px] h-[40px]">
          <InputField placeholder="Enter State" type="text" />
        </Input>
        <Input className="min-w-[250px] h-[40px]">
          <InputField placeholder="Enter Pincode" type="text" />
        </Input>
        <Input className="min-w-[250px] h-[40px]">
          <InputField placeholder="Enter Pincode" type="text" />
        </Input>
        <Button className="ml-auto py-2 h-[50px]">
          <ButtonText className="text-typography-0 w-full text-center ">
            Save
          </ButtonText>
        </Button>
        <View>
          <Text size="xl">
            Already have an Account ?{" "}
            <Link href={"/login/LoginScreen"}>
              <Text size="xl" underline bold>
                Login
              </Text>
            </Link>
          </Text>
        </View>
      </VStack>
    </FormControl>
  );
};

export default SignUpScreen;
