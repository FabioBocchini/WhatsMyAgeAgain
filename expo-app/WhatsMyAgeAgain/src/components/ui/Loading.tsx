import * as React from 'react'
import {ActivityIndicator, Text, View} from 'react-native'
import {PRIMARY_COLOR} from '../../constants/colors'

export const Loading = () => {
  return (
    <View>
      <ActivityIndicator size="large" color={PRIMARY_COLOR}/>
      <Text>Caricamento del modello...</Text>
    </View>
  )
}
