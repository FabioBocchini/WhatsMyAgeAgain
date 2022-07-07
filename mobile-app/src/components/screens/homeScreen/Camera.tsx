import React, {useState, useEffect, Dispatch, SetStateAction, useCallback, useRef} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Camera, CameraCapturedPicture, CameraType, FaceDetectionResult} from 'expo-camera'
import {Face} from 'expo-camera/build/Camera.types'
import * as FaceDetector from 'expo-face-detector'
import {Icon} from '@rneui/base'
import {FaceDetecion} from './FaceDetecion'
import {CameraCapturedPictureWithError} from '../../../types/cameraCapturedPictureWithError'
import {cropFaceFromImage} from '../../../utils/images'
import {ICON_COLOR} from '../../../constants/colors'

type TProps = {
  setPicture: Dispatch<SetStateAction<CameraCapturedPictureWithError | null>>
  setOpenCamera: Dispatch<SetStateAction<boolean>>
}

export const CustomCamera = ({setPicture, setOpenCamera}: TProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [type, setType] = useState(CameraType.front)
  const [cameraReady, setCameraReady] = useState(false)
  const [detectedFace, setDetectedFace] = useState<Face | undefined>(undefined)

  const cameraRef = useRef<Camera>(null)

  const handleFlip = useCallback(() => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back)
  }, [type])

  const handleCancel = useCallback(() => {
    setOpenCamera(false)
  }, [setOpenCamera])

  const handleCapture = useCallback(async () => {
    if (!cameraReady || !cameraRef) {
      return
    }

    await cameraRef.current?.takePictureAsync({
      onPictureSaved: async (cameraCapturedPicture: CameraCapturedPicture) =>
        setPicture(
          await cropFaceFromImage(cameraCapturedPicture, detectedFace, type)
        )
    })
  }, [cameraReady, detectedFace])

  const handleFacesDetected = (faces: FaceDetectionResult) => {
    const face = faces.faces[0]
    if (face && typeof face !== 'undefined') {
      setDetectedFace(face)
      return
    }
    setDetectedFace(undefined)
  }

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  if (hasPermission === null) {
    return <View/>
  }

  if (!hasPermission) {
    return <Text>L&apos;applicazione non ha accesso alla fotocamera</Text>
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        onCameraReady={() => setCameraReady(true)}
        ref={cameraRef}
        ratio={'1:1'}

        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 100,
          tracking: true,
        }}
      >
        <View style={styles.topRowContainer}>
          <TouchableOpacity style={styles.abortButton} onPress={handleCancel}>
            <Icon type="antdesign" name="close" size={30} color={ICON_COLOR}/>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRowContainer}>
          <View style={styles.placeholder}/>

          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <Icon type="entypo" name="circle" size={70} color={ICON_COLOR}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.flipButton} onPress={handleFlip}>
            <Icon type="antdesign" name="sync" size={30} color={ICON_COLOR}/>
          </TouchableOpacity>
        </View>

      </Camera>
      {detectedFace && <FaceDetecion face={detectedFace}/>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  camera: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
  },
  topRowContainer: {
    backgroundColor: 'black',
    justifyContent: 'flex-end',
    height: 120,
    opacity: 0.8,
    padding: 20
  },
  bottomRowContainer: {
    backgroundColor: 'black',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
    opacity: 0.8,
    padding: 20
  },
  abortButton: {
    alignSelf: 'flex-start',
    justifyContent: 'center'
  },
  flipButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
})
