import {CameraCapturedPicture} from 'expo-camera'
import {FaceDetectionError} from '../enums/faceDetectionError'

export type CameraCapturedPictureWithError = CameraCapturedPicture & { error?: FaceDetectionError }