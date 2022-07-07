import {UninterpretedPrediction} from '../types/uninterpretedPrediction'
import {Gender} from '../enums/gender'
import {Ethnicity} from '../enums/enthinicty'
import {argMax} from './array'

/**
 * Takes a model.predict() result and maps it to fit the human-readable Prediction type.
 *
 * - age is a float number, returned as a rounded int.
 * - gender is a float number between 0 and 1, closer to 0 is male and clores to 1 is female, mapped with the Gender enum.
 * - ethnicity is an array of 5 float numbers between 0 and 1, the index with the largest value is the index of the
 * ethnicity with the best probability, it is mapped with the Ethnicity enum.
 *
 * @param {UninterpretedPrediction} prediction Input image
 * @return {Prediction} Image object with update `data` field
 */
export const interpretPrediction = async (prediction: UninterpretedPrediction) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const age = await prediction[0].arraySync()[0][0]
  console.log('age:', age)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const gender = await prediction[1].arraySync()[0]
  console.log('gender:', gender[0])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const ethnicityArray = await prediction[2].arraySync()[0]
  const ethnicity = argMax(ethnicityArray)
  console.log('ethnicity:', ethnicityArray.map((value: number, index: number) => `${Ethnicity[index]}: ${value}`))

  return {
    gender: Gender[Math.round(gender)],
    age: Math.round(age),
    ethnicity: Ethnicity[ethnicity]
  }
}
