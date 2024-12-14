import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Text } from "react-native";

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <Text>Hellop wolrd!</Text>
    </GluestackUIProvider>
  );
}
