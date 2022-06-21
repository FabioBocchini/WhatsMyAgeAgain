import React, {useCallback, useState} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {CustomCamera as Camera} from './Camera'
import {Picture} from './Picture'
import {CameraCapturedPicture} from 'expo-camera'
import {Button} from '../../ui/Button'
import {PredictionResult} from './PredictionResult'
import {Prediction} from '../../../types/prediction'
import {useTensorflow} from '../../../contexts/tensorflow'

export const HomeScreen = () => {
  const [pic, setPic] = useState<CameraCapturedPicture | null>(null)
  const [openCamera, setOpenCamera] = useState(false)
  const [prediction, setPrediction] = useState<Prediction | null>(null)

  const {predict, loadingModel} = useTensorflow()

  const handleShoot = useCallback(() => {
    setPic(null)
    setOpenCamera(true)
  }, [])

  const handlePredict = useCallback(async () => {
    if (!pic) {
      console.log('pic is not set')
      return
    }

    const res = await predict(pic)
    setPrediction(res)
  }, [pic])

  return (
    <View style={styles.container}>
      {loadingModel && <Text>Sto caricando il modello...</Text>}
      {!pic ?
        <>
          {openCamera ?
            <Camera setOpenCamera={setOpenCamera} setPicture={setPic}/>
            :
            <Button onPress={handleShoot}>Scatta una foto</Button>
          }
        </>
        :
        <>
          <Button onPress={handleShoot}>Riscatta la foto</Button>
          <Picture picture={pic}/>
          {!prediction ?
            <Button onPress={handlePredict}>Fai una predizione</Button>
            :
            <PredictionResult prediction={prediction}/>
          }

        </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
})
