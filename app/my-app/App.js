import React from "react";
import { useFonts } from "expo-font";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/components/LoginScreen";
import OtpScreen from "./src/screens/OtpScreen";
import SignUp from "./src/screens/SignUp";
import HomeScreen from "./src/screens/home/HomeScreen";

const Stack = createStackNavigator();

export default function App() {
  // Load custom fonts
   const [fontsLoaded] = useFonts({
    "Poppins-Medium": require("./assets/font/Poppins-Medium.ttf"),
    "Poppins-Bold": require("./assets/font/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("./assets/font/Poppins-SemiBold.ttf"),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const isLoggedIn = true; // Example variable to toggle between logged-in and logged-out states

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn ? "HomeScreen" : "LoginScreen"}>
          {isLoggedIn ? (
            // Screens for logged-in users
            <>
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            // Screens for non-logged-in users
            <>
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="OTPScreen"
                component={OtpScreen}
                options={{ title: "OTP Verification" }}
              />
              <Stack.Screen
                name="SignUpScreen"
                component={SignUp}
                options={{ title: "Create An Account" }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", 
  },
});
