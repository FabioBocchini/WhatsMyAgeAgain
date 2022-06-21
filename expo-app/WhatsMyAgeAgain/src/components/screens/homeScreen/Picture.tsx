import React from 'react'
import {View, StyleSheet, Image} from 'react-native'
import {CameraCapturedPicture} from 'expo-camera'

type TProps = {
  picture: CameraCapturedPicture
}

export const Picture = ({picture}: TProps) => {
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
  image:{
    width: 300,
    height: 400
  }
})