import React, {useCallback, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {CustomCamera as Camera} from './Camera'
import {Picture} from './Picture'
import {Button} from '../../ui/Button'
import {PredictionResult} from './PredictionResult'
import {Prediction} from '../../../types/prediction'
import {useTensorflow} from '../../../contexts/tensorflow'
import {Loading} from '../../ui/Loading'
import {BACKGROUND_COLOR} from '../../../constants/colors'
import {CameraCapturedPictureWithError} from '../../../types/cameraCapturedPictureWithError'
import {FaceDetectionError} from '../../../enums/faceDetectionError'

export const HomeScreen = () => {
  const [pic, setPic] = useState<CameraCapturedPictureWithError | null>(null)
  const [openCamera, setOpenCamera] = useState(false)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [error, setError] = useState<FaceDetectionError | undefined>(undefined)

  const {predict, isModelLoading} = useTensorflow()

  const handleShoot = useCallback(() => {
    setPic(null)
    setPrediction(null)
    setOpenCamera(true)
  }, [])

  const handlePredict = useCallback(async () => {
    if (!pic) {
      setError(FaceDetectionError.NO_PICTURE_TAKEN)
      return
    }

    const res = await predict(pic)
    setPrediction(res)
  }, [pic])

  if (isModelLoading) {
    return (
      <View style={styles.container}>
        <Loading/>
      </View>
    )
  }

  if (!pic) {
    return (
      openCamera ?
        <Camera setOpenCamera={setOpenCamera} setPicture={setPic}/>
        :
        <View style={styles.container}>
          <Button onPress={handleShoot}>Scatta una foto</Button>
        </View>
    )
  }

  return (
    <View style={styles.container}>
      <Button onPress={handleShoot}>Riscatta la foto</Button>
      <Picture picture={pic} error={error}/>
      {!prediction ?
        <Button onPress={handlePredict}>Fai una predizione</Button>
        :
        <PredictionResult prediction={prediction}/>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
})
