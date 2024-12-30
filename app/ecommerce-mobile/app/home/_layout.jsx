import { Tabs } from "expo-router";
import { Home, List, ShoppingCart, User } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export default () => {
  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "semibold",
          textAlign: "center", // Center align the text

        },
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 60,
          paddingBottom: 5,
          backgroundColor: '#fff',
          elevation: 5, 
        },
        tabBarActiveTintColor: "#FF8765",
        tabBarInactiveTintColor: "#8e8e8e", // Inactive tab color
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Home color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="CategoryScreen"
        options={{
          tabBarLabel: "Categories",
          tabBarIcon: ({ color }) => <List color={color} />,
          headerShown: true,
          headerTitle: "All Categories", // Set custom title
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                console.log("Cart Icon Pressed");
              }}
              style={{
                marginRight: 16,
              }}
            >
              <ShoppingCart color="#FF8765" size={24} />
            </TouchableOpacity>)
        }}
      />
      <Tabs.Screen
        name="OrderScreen"
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color }) => <ShoppingCart color={color} />,
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ color }) => <User color={color} />,
          headerShown: true,
        }}
      />
    </Tabs>
  );
};
