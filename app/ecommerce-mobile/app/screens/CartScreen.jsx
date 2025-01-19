import { ScrollView, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Text } from "@/components/ui/text";
import { Trash2 } from "lucide-react-native"; // Import a delete icon

const CartScreen = () => {
  // Sample cart data
  const cartItems = [
    {
      id: 1,
      name: "Men's Slim Fit Formal Shirt",
      color: "Blue",
      size: "XL",
      price: 250,
      quantity: 2,
      image:
        "https://rukminim2.flixcart.com/flap/80/80/image/22fddf3c7da4c4f4.png?q=100", // Placeholder image URL
    },
    {
      id: 2,
      name: "Men's Slim Fit Formal Shirt",
      color: "Black",
      size: "L",
      price: 250,
      quantity: 1,
      image:
        "https://rukminim2.flixcart.com/flap/80/80/image/69c6589653afdb9a.png?q=100", // Placeholder image URL
    },
    {
      id: 3,
      name: "Men's Slim Fit Formal Shirt",
      color: "White",
      size: "M",
      price: 250,
      quantity: 3,
      image:
        "https://rukminim2.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png?q=100", // Placeholder image URL
    },
    {
      id: 4,
      name: "Men's Slim Fit Formal Shirt",
      color: "Blue",
      size: "XL",
      price: 250,
      quantity: 2,
      image:
        "https://rukminim2.flixcart.com/flap/80/80/image/22fddf3c7da4c4f4.png?q=100", // Placeholder image URL
    },
    {
      id: 5,
      name: "Men's Slim Fit Formal Shirt",
      color: "Black",
      size: "L",
      price: 250,
      quantity: 1,
      image:
        "https://rukminim2.flixcart.com/flap/80/80/image/69c6589653afdb9a.png?q=100", // Placeholder image URL
    },
    {
      id: 6,
      name: "Men's Slim Fit Formal Shirt",
      color: "White",
      size: "M",
      price: 250,
      quantity: 3,
      image:
        "https://rukminim2.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png?q=100", // Placeholder image URL
    },
  ];

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Handle delete item
  const handleDelete = (itemId) => {
    console.log("Delete item with ID:", itemId);
    // Add logic to remove the item from the cart
  };

  // Handle quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    console.log("Update quantity for item ID:", itemId, "New quantity:", newQuantity);
    // Add logic to update the quantity in the cart
  };

  return (
    <View className="flex-1">
      {/* Scrollable Cart Items */}
      <ScrollView className="bg-gray-100 p-4 mb-[50px]">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold">Items ({cartItems.length})</Text>
          <Text className="text-lg font-bold">Total ₹{totalPrice}</Text>
        </View>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <View key={item.id} className="bg-white p-4 rounded-lg shadow-sm mb-4">
            {/* Delete Button (Top-Right Corner) */}
            <TouchableOpacity
              className="absolute top-2 right-2 p-2"
              onPress={() => handleDelete(item.id)}
            >
              <Trash2 size={20} color="#FF8765" />
            </TouchableOpacity>

            {/* Product Image and Details */}
            <View className="flex-row items-center">
              {/* Product Image */}
              <Image
                source={{ uri: item.image }}
                className="w-20 h-20 bg-gray-100 rounded-lg mr-4"
              />

              {/* Product Details */}
              <View className="flex-1">
                <Text className="text-lg font-medium">{item.name}</Text>
                <Text bold className="text-gray-600">
                  Color: {item.color}
                </Text>
                <Text bold className="text-gray-600">
                  Size: {item.size}
                </Text>
                <Text bold className="text-gray-600">
                  ₹{item.price} x {item.quantity}
                </Text>
              </View>
            </View>

            {/* Quantity Selector (Bottom of Card) */}
            <View className="flex flex-row items-center bg-[#F5F5F5] w-[100px] rounded-lg justify-between self-end mt-2">
              <TouchableOpacity
                className="px-3 py-[4px] bg-[#2B2B2B] rounded-md"
                onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                <Text className="text-lg text-[#FF8765] font-bold">-</Text>
              </TouchableOpacity>
              <Text className="text-lg font-bold">{item.quantity}</Text>
              <TouchableOpacity
                className="px-3 py-[4px] bg-[#2B2B2B] rounded-md"
                onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                <Text className="text-lg text-[#FF8765] font-bold">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Fixed Footer (Total Price and Place Order Button) */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="flex-row">
          {/* Total Price (50% width) */}
          <View className="flex-1 p-4 justify-center">
            <Text className="text-lg font-bold">Total ₹{totalPrice}</Text>
          </View>

          {/* Place Order Button (50% width) */}
          <TouchableOpacity className="flex-1 bg-[#2B2B2B] justify-center items-center ">
            <Text className="text-white text-lg font-bold">Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CartScreen;