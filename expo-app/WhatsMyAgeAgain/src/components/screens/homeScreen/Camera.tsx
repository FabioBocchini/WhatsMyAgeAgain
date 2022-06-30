import React, {useState, useEffect, Dispatch, SetStateAction, useCallback, useRef} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Camera, CameraCapturedPicture, CameraType} from 'expo-camera'
import {Icon} from '@rneui/base'
import {ICON_COLOR} from '../../../constants/colors'

type TProps = {
  setPicture: Dispatch<SetStateAction<CameraCapturedPicture | null>>
  setOpenCamera: Dispatch<SetStateAction<boolean>>
}

export const CustomCamera = ({setPicture, setOpenCamera}: TProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [type, setType] = useState(CameraType.front)
  const [cameraReady, setCameraReady] = useState(false)

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
      isImageMirror: true,
      onPictureSaved: setPicture,
      base64: true
    })
  }, [cameraReady])

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
      <Camera style={styles.camera} type={type} onCameraReady={() => setCameraReady(true)} ref={cameraRef}>

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
