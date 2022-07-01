import {UninterpretedPrediction} from '../types/uninterpretedPrediction'
import {Gender} from '../enums/gender'
// import {Ethnicity} from 's../enums/enthinicty'

export const interpretPrediction = async (prediction: UninterpretedPrediction) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const age = await prediction[0].arraySync()[0][0]
  console.log('age:', age)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const gender = await prediction[1].arraySync()[0][0]
  console.log('gender:', gender)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // const ethnicity = await prediction[2].arraySync()[0][0]
  // console.log('ethnicity:', ethnicity)

  return {
    gender: Gender[Math.round(gender)],
    age: Math.round(age),
    // ethnicity: Ethnicity[Math.round(age)]
  }
}