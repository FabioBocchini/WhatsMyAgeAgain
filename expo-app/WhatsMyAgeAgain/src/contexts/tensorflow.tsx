import React, {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {Prediction} from '../types/prediction'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-react-native'
import {bundleResourceIO, decodeJpeg, fetch} from '@tensorflow/tfjs-react-native'
import {CameraCapturedPicture} from 'expo-camera'
import {manipulateAsync} from 'expo-image-manipulator'

const MODEL_PATH = '../../assets/model/model.json'
const WEIGHTS_PATH = '../../assets/model/group1-shard1of1.bin'

type TProps = {
  children: JSX.Element
}

type TContext = {
  loadingModel: boolean
  predict: (T: CameraCapturedPicture) => Promise<Prediction>
}

const TensorflowContext = createContext({} as TContext)

export const TensorflowProvider = ({ children }: TProps) => {
  const [loadingModel, setLoadingModel] = useState(false)
  const [model, setModel] = useState<tf.LayersModel | null>(null)

  const loadModel = useCallback(async () => {
    await tf.ready()
    setLoadingModel(true)
    try {

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const modelJson = require(MODEL_PATH)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const modelWeights = require(WEIGHTS_PATH)

      const m = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights))
      setModel(m)
    } catch (e) {
      console.error(e)
    }
    setLoadingModel(false)
  }, [])

  const predict = useCallback(async (picture: CameraCapturedPicture) => {
    try {
      const resizedImage = await manipulateAsync(picture.uri, [{ resize: { height: 128, width: 128 }}])

      const response = await fetch(resizedImage.uri, {}, {isBinary: true})
      const imageDataArrayBuffer = await response.arrayBuffer()
      const imageData = new Uint8Array(imageDataArrayBuffer)

      const grayscale = imageData.reduce((previousValue: any, currentValue, currentIndex) => {
        if (currentIndex % 3 === 0){
          return [...previousValue, currentValue]
        }
        return previousValue
      }, [])

      const imageTensor = decodeJpeg(grayscale, 1)

      console.log('started prediction')
      const result = model?.predict(imageTensor)
      console.log(result)
      return {age: 10, gender: 'M', ethnicity: 'aaa'} as Prediction
    }catch (e){
      console.error(e)
      return {} as Prediction
    }
  }, [])

  useEffect(() => {
    (async () => loadModel())()

    return(() => {
      setModel(null)
    })
  }, [])

  return(
    <TensorflowContext.Provider value={{
      loadingModel,
      predict
    }}>
      { children }
    </TensorflowContext.Provider>
  )
}

export const useTensorflow = () => useContext<TContext>(TensorflowContext)