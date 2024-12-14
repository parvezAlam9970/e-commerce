import { Stack } from 'expo-router'
import React from 'react'
import '/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';



const RootLayout = () => {
  return (
    <GluestackUIProvider>

    <Stack/>

    </GluestackUIProvider>

  )
}

export default RootLayout