import {GestureResponderEvent, StyleSheet, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import {PRIMARY_COLOR} from '../../constants/colors'

type TProps = {
  children: string
  onPress: ((event: GestureResponderEvent) => void) | undefined
}
export const Button = ( {children, onPress}: TProps ) => {
  return(
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button:{
    width: '90%',
    borderRadius: 4,
    backgroundColor: PRIMARY_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  buttonText:{
    color: 'white',
    fontWeight: 'bold',
  }
})
