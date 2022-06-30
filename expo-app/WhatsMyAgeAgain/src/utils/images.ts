import {manipulateAsync} from 'expo-image-manipulator'
import {fetch} from '@tensorflow/tfjs-react-native'
import {CameraCapturedPicture} from 'expo-camera'

const resizeImage = async (image: CameraCapturedPicture) => {
  const a = await manipulateAsync(image.uri, [{resize: {height: 128, width: 128}}])
  return {
    ...a,
    base64: image.base64
  }
}

const imageToUint8Array = async (image: CameraCapturedPicture) => {

  const response = await fetch(image.uri, {}, {isBinary: true})
  const imageDataArrayBuffer = await response.arrayBuffer()
  const data = new Uint8Array(imageDataArrayBuffer)

  return {
    data,
    height: image.height,
    width: image.width
  }
}

export const preprocessImageForTensorflow = async (image: CameraCapturedPicture) => {
  const r = await resizeImage(image)
  return imageToUint8Array(r)
}
