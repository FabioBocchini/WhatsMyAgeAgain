import {FlipType, manipulateAsync} from 'expo-image-manipulator'
import {fetch} from '@tensorflow/tfjs-react-native'
import {CameraCapturedPicture, CameraType} from 'expo-camera'
import {Face} from 'expo-camera/build/Camera.types'
import {FaceDetectionError} from '../enums/faceDetectionError'
import {Dimensions} from 'react-native'


/**
 * Resizes an image to be 128x128 pixels.
 *
 * @param {CameraCapturedPicture} image Input image
 * @return {CameraCapturedPicture} Resized image
 */
const resizeImage = async (image: CameraCapturedPicture) => {
  return manipulateAsync(image.uri, [{resize: {height: 128, width: 128}}])
}

/**
 * Updates a CameraCaputredPicture `data` field to store a Uint8Array instead of the image uri.
 *
 * @param {CameraCapturedPicture} image Input image
 * @return {CameraCapturedPicture} Image object with update `data` field
 */
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

/**
 * Process the image passed to be used with the tensorflow model. It applies resizeImage() and imageToUint8Array().
 *
 * @param {CameraCapturedPicture} image Input image
 * @return {CameraCapturedPicture} Processed image
 */
export const preprocessImageForTensorflow = async (image: CameraCapturedPicture) => {
  const r = await resizeImage(image)
  return imageToUint8Array(r)
}

/**
 * Crops the image using the coordinates returned from the face recognition.
 *
 * @param {CameraCapturedPicture} image Input image
 * @param {Face | undefined} detectedFaceFeatures Coordinates of the face recognition square
 * @param {CameraType} cameraType Front or Back camera
 * @return {CameraCapturedPicture} Processed image
 */
export const cropFaceFromImage = async (
  image: CameraCapturedPicture,
  detectedFaceFeatures: Face | undefined,
  cameraType: CameraType
) => {

  // if face recognition does not find a face returns an error
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

  // calculting coordinates based on the screen dimensions
  const windowWidth = Dimensions.get('screen').width
  const windowHeight = Dimensions.get('screen').height

  const wRatio = image.width / (windowWidth)
  const hRatio = image.height / (windowHeight)

  const originX = origin.x * wRatio
  const originY = origin.y * hRatio
  const width = size.width * wRatio
  const height = size.height * hRatio

  // reduce the image by 8% from the original coordinates to better fit the face
  const shift = 8
  const orizontalShift = originX / 100 * shift
  const verticalShift = originY / 100 * shift

  return manipulateAsync(flippedImage.uri, [{
    crop: {
      originX: originX + orizontalShift,
      originY: originY + verticalShift,
      width: width - 2 * orizontalShift,
      height: height - 2 * verticalShift
    }
  }])
}
