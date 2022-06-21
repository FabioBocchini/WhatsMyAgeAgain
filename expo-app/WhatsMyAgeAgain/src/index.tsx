import React from 'react'
import {HomeScreen} from './components/screens/homeScreen'
import {TensorflowProvider} from './contexts/tensorflow'

export const App = () => {
  return (
    <TensorflowProvider >
      <HomeScreen />
    </TensorflowProvider>
  )
}

