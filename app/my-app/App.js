import { useFonts } from "expo-font";
import LoginScreen from "./src/components/LoginScreen";
import AppLoading from "expo-app-loading";



export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins: require("./assets/font/Poppins-Medium.ttf"),
    "Poppins-Bold": require("./assets/font/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
   <LoginScreen/>
  );
}

