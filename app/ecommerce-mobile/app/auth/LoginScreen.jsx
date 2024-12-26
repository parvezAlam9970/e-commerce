import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";

import React from "react";
import { View } from "react-native";

// import

const LoginScreen = () => {
  return (
    <FormControl className="p-4 px-7 border bg-white h-full flex justify-center items-center rounded-lg border-outline-300">
      <VStack space="xl">
        <Heading size="2xl" bold className="text-center">
          Login
        </Heading>
        <VStack space="xs">
          <Text size="xl" className="text-typography-500">
            Email
          </Text>
          <Input className="min-w-[250px] h-[50px]">
            <InputField type="text" />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text size={"xl"} className="text-typography-500">
            Password
          </Text>
          <Input className="text-center  h-[50px]">
            <InputField type={true ? "text" : "password"} />
            <InputSlot className="pr-3">
              <InputIcon as={true ? EyeIcon : EyeOffIcon} />
            </InputSlot>
          </Input>
        </VStack>
        <Button className="ml-auto py-2 h-[50px]">
          <ButtonText className="text-typography-0 w-full text-center ">
            Save
          </ButtonText>
        </Button>
        <View>
          <Text size="xl">
            Create an Account ?{" "}
            <Link href={"/auth/signUpScreen"}>
              <Text size="xl" underline bold>
                Sign Up
              </Text>
            </Link>
          </Text>
        </View>
      </VStack>
    </FormControl>
  );
};

export default LoginScreen;



