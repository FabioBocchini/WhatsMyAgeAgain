import React, {useEffect} from 'react'
import {View, StyleSheet, Image} from 'react-native'
import {CameraCapturedPictureWithError} from '../../../types/cameraCapturedPictureWithError'
import {FaceDetectionError} from '../../../enums/faceDetectionError'

type TProps = {
  picture: CameraCapturedPictureWithError
}

export const Picture = ({picture}: TProps) => {

  useEffect(() => {
    if(picture.error){
      console.error(FaceDetectionError[picture.error])
    }
  }, [picture])

  return (
    <View>
      <Image
        source={{uri: picture.uri}}
        style={styles.image}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 350,
    height: 350
  }
})