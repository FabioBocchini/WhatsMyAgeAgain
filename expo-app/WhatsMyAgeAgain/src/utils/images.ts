import {FlipType, manipulateAsync} from 'expo-image-manipulator'
import {fetch} from '@tensorflow/tfjs-react-native'
import {CameraCapturedPicture, CameraType} from 'expo-camera'
import {Face} from 'expo-camera/build/Camera.types'
import {FaceDetectionError} from '../enums/faceDetectionError'
import {Dimensions} from 'react-native'


const resizeImage = async (image: CameraCapturedPicture) => {
  return manipulateAsync(image.uri, [{resize: {height: 128, width: 128}}])
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

export const cropFaceFromImage = async (
  image: CameraCapturedPicture,
  detectedFaceFeatures: Face | undefined,
  cameraType: CameraType
) => {
  if (typeof detectedFaceFeatures === 'undefined') {
    return {
      ...image,
      error: FaceDetectionError.NO_FACE_DETECTED
    }
  }

  // flipping the image only if it's taken from front cameras
  const flippedImage = cameraType === CameraType.front ?
    await manipulateAsync(image.uri, [{flip: FlipType.Horizontal}]) :
    image

  const {origin, size} = detectedFaceFeatures.bounds

  const windowWidth = Dimensions.get('screen').width
  const windowHeight = Dimensions.get('screen').height

  const wRatio = image.width / (windowWidth)
  const hRatio = image.height / (windowHeight)

  const originX = origin.x * wRatio
  const originY = origin.y * hRatio
  const width = size.width * wRatio
  const height = size.height * hRatio

  const shift = 20
  const orizontalShift = originX / 100 * shift
  const verticalShift = originY / 100 * shift

  return manipulateAsync(flippedImage.uri, [{
    crop: {
      originX: originX - orizontalShift,
      originY: originY - verticalShift,
      width: width + 2 * orizontalShift,
      height: height + 2 * verticalShift
    }
  }])
}
