import React, {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {Prediction} from '../types/prediction'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-react-native'
import {bundleResourceIO, decodeJpeg} from '@tensorflow/tfjs-react-native'
import {CameraCapturedPicture} from 'expo-camera'
import {preprocessImageForTensorflow} from '../utils/images'
import {interpretPrediction} from '../utils/prediction'

const MODEL_DIR = '../../assets/model'
const MODEL_PATH = `${MODEL_DIR}/model.json`
const WEIGHTS_PATH = `${MODEL_DIR}/group1-shard1of1.bin`

type TProps = {
  children: JSX.Element
}

type TContext = {
  isModelLoading: boolean
  predict: (T: CameraCapturedPicture) => Promise<Prediction | null>
}

const TensorflowContext = createContext({} as TContext)

export const TensorflowProvider = ({children}: TProps) => {
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [model, setModel] = useState<tf.LayersModel | null>(null)

  /**
   * Loads the model from the `assets` directory, while doing so puts the app in a loading state.
   *
   */
  const loadModel = useCallback(async () => {
    setIsModelLoading(true)
    await tf.ready()
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
    setIsModelLoading(false)
  }, [])

  /**
   * Processes the picture, normalizes it and calls model.predict().
   *
   * @param {CameraCapturedPicture} picture Full picture taken from camera
   * @return {Prediction | null} Human-readable prediction, null if there is an error
   */
  const predict = useCallback(async (picture: CameraCapturedPicture) => {
    if (model === null) {
      console.error('model is not ready yet')
      return null
    }

    try {
      const processedPicture = await preprocessImageForTensorflow(picture)
      const imageTensor = decodeJpeg(processedPicture.data, 3)
      const reshaped = tf.reshape(imageTensor, [1, 128, 128, 3])
      const normalized = reshaped.div(255)
      const result = model.predict(normalized)

      return interpretPrediction(result)
    } catch (e) {
      console.error(e)
      return null
    }
  }, [model])

  // the model is loaded as soon as the app starts
  useEffect(() => {
    (async () => loadModel())()

    return (() => {
      setModel(null)
    })
  }, [])

  return (
    <TensorflowContext.Provider value={{
      isModelLoading,
      predict,
    }}>
      {children}
    </TensorflowContext.Provider>
  )
}

export const useTensorflow = () => useContext<TContext>(TensorflowContext)
