import { Image, ScrollView, TouchableOpacity, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';

const CheckOutScreen = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const addresses = [
    {
      id: 1,
      type: 'Home',
      contactPerson: 'Alex Davidson',
      address: '21, Alex Davidson Avenue, Opposite Omegatron, Vicent Smith Quarters, Victoria Island, Lagos, Nigeria',
    },
    {
      id: 2,
      type: 'Work',
      contactPerson: 'Vicent Smith',
      address: '19, Martins Crescent, Bank of Nigeria, Abuja, Nigeria',
    },
  ];

  const cartItems = [
    {
      id: 1,
      name: "Men's Slim Fit Formal Shirt",
      color: "Blue",
      size: "XL",
      price: 250,
      quantity: 2,
      image: "https://rukminim2.flixcart.com/flap/80/80/image/22fddf3c7da4c4f4.png?q=100",
    },
    {
      id: 2,
      name: "Men's Slim Fit Formal Shirt",
      color: "Black",
      size: "L",
      price: 250,
      quantity: 1,
      image: "https://rukminim2.flixcart.com/flap/80/80/image/69c6589653afdb9a.png?q=100",
    },
    {
      id: 3,
      name: "Men's Slim Fit Formal Shirt",
      color: "White",
      size: "M",
      price: 250,
      quantity: 3,
      image: "https://rukminim2.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png?q=100",
    },
  ];

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = cartTotal * 0.1; // Assuming 10% tax
  const deliveryCharge = 50; // Fixed delivery charge
  const totalAmount = cartTotal - discount + tax + deliveryCharge;

  const applyCoupon = () => {
    // Example logic for applying a coupon
    if (voucherCode === 'DISCOUNT10') {
      setDiscount(cartTotal * 0.1); // 10% discount
    } else {
      setDiscount(0);
    }
  };

  return (
    <View className='flex-1'>
      <ScrollView className='bg-gray-100 p-4 mb-[50px]'>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold">Items {cartItems.length}</Text>
          <Text size="2xl" bold className="">
            Total : ₹{cartTotal}
          </Text>
        </View>

        {cartItems.map((item) => (
          <View key={item.id} className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <View className="flex-row items-center">
              <Image
                source={{ uri: item.image }}
                className="w-20 h-20 bg-gray-100 rounded-lg mr-4"
              />
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
          </View>
        ))}

        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <Text className="text-xl font-bold mb-4">Apply Coupon</Text>
          <View className="flex-row items-center mb-4">
            <TextInput
              className="flex-1 border border-gray-200 rounded-lg p-2 mr-2"
              placeholder="Enter Voucher Code"
              value={voucherCode}
              onChangeText={setVoucherCode}
            />
            <TouchableOpacity
              className="bg-[#2B2B2B] px-5 py-2 rounded-lg"
              onPress={applyCoupon}
            >
              <Text bold className="text-white">
                APPLY
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Text className="text-lg font-bold mb-4">All Coupons</Text> */}
        </View>

        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <Text className="text-xl font-bold mb-4">Price Details</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Cart Total</Text>
            <Text className="text-gray-600">₹{cartTotal}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Discount</Text>
            <Text className="text-gray-600">-₹{discount}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Tax</Text>
            <Text className="text-gray-600">₹{tax}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Delivery Charge</Text>
            <Text className="text-gray-600">₹{deliveryCharge}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold">Total Amount</Text>
            <Text className="text-lg font-bold">₹{totalAmount}</Text>
          </View>
        </View>

        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <Text className="text-lg font-bold mb-4">Select Delivery Address</Text>
          {addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              className={`p-4 border rounded-lg mb-2 ${selectedAddress?.id === address.id ? 'border-blue-500' : 'border-gray-200'}`}
              onPress={() => setSelectedAddress(address)}
            >
              <Text bold className="text-gray-800">
                {address.type} Address
              </Text>
              <Text className="text-gray-600">{address.contactPerson}</Text>
              <Text className="text-gray-600">{address.address}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity className="p-4 border border-gray-200 rounded-lg">
            <Text bold className="text-blue-500">
              + Add new address
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="flex-row">
          <View className="flex-1 p-4 justify-center">
            <Text size="2xl" bold className="">
              Total : ₹{totalAmount}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/screens/CheckOutScreen")}
            className="flex-1 h-[50px] bg-[#2B2B2B] justify-center items-center"
          >
            <Text bold size={"xl"} className='text-white'>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CheckOutScreen;