import React, {useState, useEffect, Dispatch, SetStateAction, useCallback, useRef} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Camera, CameraCapturedPicture, CameraType} from 'expo-camera'

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
      onPictureSaved: setPicture
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

        <View style={styles.abortButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={styles.text}> Cancel </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.captureButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCapture}>
            <Text style={styles.text}> Scatta </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.flipButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleFlip}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>

      </Camera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  camera: {
    flex: 1,
  },
  abortButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  flipButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  captureButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.2,
    alignSelf: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
})