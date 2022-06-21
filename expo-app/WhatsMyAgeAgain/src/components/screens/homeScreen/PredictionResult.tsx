import React from 'react'
import {Text, View} from 'react-native'
import {Prediction} from '../../../types/prediction'

type Tprops = {
  prediction: Prediction 
}
export const PredictionResult = ({prediction}: Tprops) => {
  return (
    <View>
      <Text>Età: {prediction.age}</Text>
      <Text>Sesso: {prediction.gender}</Text>
      <Text>Etnia: {prediction.ethnicity}</Text>
    </View>
  )
}