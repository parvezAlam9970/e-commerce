import { Button, ButtonText } from '@/components/ui/button'
import React from 'react'
import { Text, View } from 'react-native'

// import 

const HomeScreen = () => {
  return (
    <View>
        <Text className="text-red-500">
            Home Screen
        </Text>
        
        <Button size="md" variant="solid" action="primary" >
          <ButtonText>Hello World!</ButtonText>
        </Button>
      

    </View>
  )
}

export default HomeScreen