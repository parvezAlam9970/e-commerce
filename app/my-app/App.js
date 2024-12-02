import { useFonts } from "expo-font";
import LoginScreen from "./src/components/LoginScreen";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OtpScreen from "./src/screens/OtpScreen";
import SignUp from "./src/screens/SignUp";

const Stack = createStackNavigator();


export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-medium": require("./assets/font/Poppins-Medium.ttf"),
    "Poppins-Bold": require("./assets/font/Poppins-Bold.ttf"),
    "Poppins-semiBold": require("./assets/font/Poppins-SemiBold.ttf"),

  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="LoginScreen" component={LoginScreen}    options={{ headerShown: false }} 
 />
       <Stack.Screen name="OTPScreen" component={OtpScreen} options={{ title: 'OTP Verification' }} />
      <Stack.Screen name="SignUpScreen" component={SignUp} options={{ title: 'Create An Account' }} /> 
    </Stack.Navigator>
  </NavigationContainer>  );
}

