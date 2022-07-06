import {FaceDetectionError} from '../enums/faceDetectionError'

const faceDetectionErrorMessages: string[] = []

faceDetectionErrorMessages[FaceDetectionError.NO_PICTURE_TAKEN] = 'La foto non è stata scattata'
faceDetectionErrorMessages[FaceDetectionError.NO_FACE_DETECTED] = 'Non è stato riconosciuto alcun volto'

export {
  faceDetectionErrorMessages
}