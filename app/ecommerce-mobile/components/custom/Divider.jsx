import { View, Text } from 'react-native'
import React from 'react'

const Divider = ({className}) => {
  return (
    <View className={`w-full h-[1px] bg-[#D2D2D2] ${className} `}>
    </View>
  )
}

export default Divider