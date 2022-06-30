import {Gender} from '../enums/gender'
import {UninterpretedPrediction} from '../types/uninterpretedPrediction'

export const interpretPrediction = async (prediction: UninterpretedPrediction) => {

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const gender = await prediction.arraySync()[0][0]

  console.log('gender:', gender)

  return {
    gender: Gender[Math.round(gender)]
  }
}