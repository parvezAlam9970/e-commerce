import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import "/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { TouchableOpacity } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"; // Import SafeAreaView and SafeAreaProvider

const RootLayout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isLogged, setIsLogged] = useState(null); // Track login state

  // Simulate login check
  useEffect(() => {
    setTimeout(() => {
      const userLoggedIn = true; // Replace with real login check logic
      setIsLogged(userLoggedIn);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isLogged !== null) {
      if (isLogged) {
        router.replace("/home/HomeScreen"); // Redirect logged-in users to HomeScreen
      } else {
        router.replace("/auth/LoginScreen"); // Redirect unauthenticated users to LoginScreen
      }
    }
  }, [isLogged, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <GluestackUIProvider>
          <Stack
            screenOptions={{
              headerShown: false, // Hide the header for all screens in the Tabs
            }}
          >
            <Stack.Screen
              name="home/HomeScreen"
              options={{
                headerShown: false, // Hide only the header for HomeScreen
              }}
            />
            {/* Login Screen */}
            <Stack.Screen
              name="auth/LoginScreen"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen name="screens/ProductDetail" />
            <Stack.Screen name="screens/productsList" />
            <Stack.Screen
              name="screens/CartScreen"
              options={{
                title: "Cart",
                headerShown: true,
              }}
            />

            {/* Sign Up Screen */}
            <Stack.Screen
              name="auth/SignUpScreen"
              options={{
                title: "Sign Up",
                headerShown: true,
              }}
            />
          </Stack>
        </GluestackUIProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RootLayout;