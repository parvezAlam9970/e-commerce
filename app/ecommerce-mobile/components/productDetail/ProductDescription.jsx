import { View } from 'react-native'
import React from 'react'
import { Text } from '../ui/text'
import { Icon } from '../ui/icon'
import { Heart, Star } from 'lucide-react-native'
import Divider from '../custom/Divider'

const ProductDescription = () => {
  return (
    <View className='text-black'>
        <View className='flex flex-row w-full items-center justify-between'>

      <Text size='lg' bold className=' flex justify-between items-center'   >Men's' Slim fit Formal Trousers
      </Text>
      <Icon  as={Heart} className='w-5 h-5' />

        </View>
        <View className='flex my-1 flex-row gap-x-1'>
            {
                [1,2,3,4,5]?.map((elm , i)=>(
                    <Icon key={i}  as={Star} className='fill-[#FCB13E] text-[#FCB13E] outline-none border-none' />
                ))
            }
            <Text size='md'>
                4.9
            </Text>
        </View>
        <Text size='2xl'  bold>
                ₹5000
            </Text>
    </View>
  )
}

export default ProductDescription