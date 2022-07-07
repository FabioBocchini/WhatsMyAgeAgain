import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {ERROR_COLOR, ICON_COLOR} from '../../constants/colors'
import {Icon} from '@rneui/base'

type TProps = {
  children: string
  show: boolean
}
export const ErrorMessage = ({children, show}: TProps) => {
  if (!show) {
    return <></>
  }

  return (
    <View style={styles.error}>
      <Icon type="antdesign" name="warning" size={20} color={ICON_COLOR} style={styles.icon}/>
      <Text style={styles.errorText}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  error: {
    borderRadius: 4,
    backgroundColor: ERROR_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginTop: -50
  },
  icon:{
    paddingRight: 20
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold',
  }
})
