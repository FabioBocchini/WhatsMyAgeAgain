import * as React from 'react'
import {Face} from 'expo-camera/build/Camera.types'
import {StyleSheet, View} from 'react-native'
import {SECONDARY_COLOR} from '../../../constants/colors'

type TProps = {
  face: Face
}

export const FaceDetecion = ({face}: TProps) => {
  const {size, origin} = face.bounds

  return (
    <View
      style={[
        styles.face,
        {
          width: size.width,
          height: size.height,
          left: origin.x,
          top: origin.y,
        },
      ]}>
    </View>
  )
}

const styles = StyleSheet.create({
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 1,
    position: 'absolute',
    borderColor: SECONDARY_COLOR,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
})