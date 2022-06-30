import React from 'react'
import {Text, View, StyleSheet} from 'react-native'
import {Prediction} from '../../../types/prediction'

type Tprops = {
  prediction: Prediction
}

export const PredictionResult = ({prediction}: Tprops) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Sesso:</Text><Text style={styles.prediction}>{prediction.gender}</Text>
      <Text style={styles.name}>Età:</Text><Text style={styles.prediction}>{' '}</Text>
      <Text style={styles.name}>Etnia:</Text><Text style={styles.prediction}>{' '}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    display:'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
    height: 50
  },
  name: {
    flexBasis: '40%',
    fontWeight: 'bold',
    textAlign: 'right',
    padding: 4
  },
  prediction: {
    flexBasis: '40%',
    padding: 4
  }
})
