/**
 * Retrieve the array key corresponding to the largest element in the array.
 *
 * @param {Array.<number>} array Input array
 * @return {number} Index of array element with the largest value
 */
export const argMax = (array: never[]) => {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1]
}
