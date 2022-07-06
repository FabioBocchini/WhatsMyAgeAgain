import {UninterpretedPrediction} from '../types/uninterpretedPrediction'
import {Gender} from '../enums/gender'
import {Ethnicity} from '../enums/enthinicty'
import {argMax} from './array'

export const interpretPrediction = async (prediction: UninterpretedPrediction) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const age = await prediction[0].arraySync()[0][0]
  console.log('age:', age)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const genderArray = await prediction[1].arraySync()[0]
  const gender = argMax(genderArray)
  console.log('gender:', genderArray[gender])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const ethnicityArray = await prediction[2].arraySync()[0]
  const ethnicity = argMax(ethnicityArray)
  console.log('ethnicity:', ethnicityArray.map((value: number, index: number) => `${Ethnicity[index]}: ${value}`))

  return {
    gender: Gender[gender],
    age: Math.round(age),
    ethnicity: Ethnicity[ethnicity]
  }
}