import React, {useEffect} from 'react'
import {View, StyleSheet, Image} from 'react-native'
import {CameraCapturedPictureWithError} from '../../../types/cameraCapturedPictureWithError'
import {FaceDetectionError} from '../../../enums/faceDetectionError'
import {faceDetectionErrorMessages} from '../../../constants/faceDetectionErrorMessages'
import {ErrorMessage} from '../../ui/ErrorMessage'


type TProps = {
  picture: CameraCapturedPictureWithError,
  error: FaceDetectionError | undefined
}

export const Picture = ({picture, error}: TProps) => {

  useEffect(() => {
    if (picture.error) {
      console.error(FaceDetectionError[picture.error])
    }
    if (error) {
      console.error(error)
    }
  }, [picture])

  return (
    <View>
      <Image
        source={{uri: picture.uri}}
        style={styles.image}
      />

      <ErrorMessage show={typeof picture.error !== 'undefined'}>
        {faceDetectionErrorMessages[picture.error!]}
      </ErrorMessage>   
      
      <ErrorMessage show = {typeof error !== 'undefined'}>
        {faceDetectionErrorMessages[error!]}
      </ErrorMessage>
        
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 350,
    height: 350,
    borderRadius: 4
  },
})