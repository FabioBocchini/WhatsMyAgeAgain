import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {HomeScreen} from './components/screens/homeScreen'
import {TensorflowProvider} from './contexts/tensorflow'

export const App = () => {
  return (
    <SafeAreaProvider>
      <TensorflowProvider >
        <HomeScreen />
      </TensorflowProvider>
    </SafeAreaProvider>
  )
}

