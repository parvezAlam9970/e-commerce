import { Stack, Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import "/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { Home, ShoppingCart, User, List } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

const RootLayout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isLogged, setIsLogged] = useState(null); // Track login state

  // Simulate login check
  useEffect(() => {
    setTimeout(() => {
      const userLoggedIn = true; // Replace with actual login check logic
      setIsLogged(userLoggedIn);
      setIsLoading(false); // Stop loading after determining login status
    }, 1000); // Simulated delay
  }, []);

  useEffect(() => {
    if (isLogged !== null && !isLogged) {
      // Redirect to login screen if not logged in
      router.replace("/auth/LoginScreen");
    }
  }, [isLogged, router]);

  if (isLoading) {
    return <LoadingScreen />; // Show loading screen while checking login status
  }

  return (
    <GluestackUIProvider>
      {isLogged ? (
        // Tabs for logged-in users
        <Tabs
          screenOptions={{
            tabBarStyle: { backgroundColor: "#fff" },
            tabBarActiveTintColor: "#FF8765",
            tabBarInactiveTintColor: "#aaa",
          }}
        >
          {/* Home Screen */}
          <Tabs.Screen
            name="index"
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color }) => (
                <Icon as={Home} className={`text-[${color}]`} />
              ),
              headerShown: false,
            }}
          />
          {/* Categories */}
          <Tabs.Screen
            name="categories/CategoryScreen"
            options={{
              tabBarLabel: "Categories",
              tabBarIcon: ({ color }) => (
                <Icon as={List} className={`text-[${color}]`} />
              ),
            }}
          />
          {/* Orders */}
          <Tabs.Screen
            name="orders/OrderScreen"
            options={{
              tabBarLabel: "Orders",
              tabBarIcon: ({ color }) => (
                <Icon as={ShoppingCart} className={`text-[${color}]`} />
              ),
            }}
          />
          {/* Account */}
          <Tabs.Screen
            name="profile/ProfileScreen"
            options={{
              tabBarLabel: "Account",
              tabBarIcon: ({ color }) => (
                <Icon as={User} className={`text-[${color}]`} />
              ),
            }}
          />
        </Tabs>
      ) : (
        // Stack navigation for unauthenticated users (Login & SignUp)
        <Stack>
          <Stack.Screen
            name="auth/LoginScreen"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="auth/SignUpScreen"
            options={{
              title: "Sign Up",
              headerShown: false,
            }}
          />
        </Stack>
      )}
    </GluestackUIProvider>
  );
};

export default RootLayout;
