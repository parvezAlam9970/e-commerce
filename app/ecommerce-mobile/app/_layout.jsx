import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import "/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { Pressable } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

const RootLayout = () => {
  // Replace this with your actual login check logic

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isLogged, setIsLogged] = useState(null); // Track login state

  useEffect(() => {
    // Simulate checking for login status
    setTimeout(() => {
      const userLoggedIn = true; // Replace with actual logic (e.g., check auth)
      setIsLogged(userLoggedIn);
      setIsLoading(false); // Stop loading after determining login status
    }, 1000); // Simulated delay
  }, []);

  useEffect(() => {
    if (isLogged !== null) {
      if (isLogged) {
        // Redirect to HomeScreen
        router.replace("/");
      } else {
        // Redirect to LoginScreen
        router.replace("/login/LoginScreen");
      }
    }
  }, [isLogged, router]);

  return (
    <GluestackUIProvider>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Stack
            screenOptions={{
              headerRight: () => (
                <Pressable className="flex-row gap-2">
                  <Icon as={ShoppingCart} />
                </Pressable>
              ),
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="signUp/signUpScreen"
              options={{ title: "Sign Up" }}
            />
            <Stack.Screen
              name="home/LoginScreen"
              options={{ title: "Login" }}
            />
          </Stack>
        </>
      )}
    </GluestackUIProvider>
  );
};

export default RootLayout;
