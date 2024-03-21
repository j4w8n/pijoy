/**
 * 
 * @param {import("pijo").ProblemDetail} data 
 */
export const validate = (data) => {
  const { status } = data
  const keys_to_check = [ 'type', 'title', 'detail', 'instance' ]

  if (!status) throw new Error('Member `status` must be passed into `problem()`.')
  if (typeof status !== 'number') throw new Error('Member `status` must be a number.')
  if (status < 100 || status > 599) throw new Error('Member `status` must be a number in the range of 100-599.')

  /** If `keys_to_check` members are present in `data`,
   * ensure their values are of type `string`.
   */
  for (const [key, value] of Object.entries(data)) {
    if (keys_to_check.find(k => k === key) && typeof value !== 'string')
      throw new Error(`Member ${key} must be a string.`)
  }
}
