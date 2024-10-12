/**
 * Validate that Problem Detail standard members are the correct type.
 * 
 * Per spec, ignore values that do not match the specified type.
 * Also, do not return keys whose value is `undefined`.
 * 
 * @param {import("pijoy").ProblemInstance} data 
 * @returns {import("pijoy").ProblemInstance}
 */
export const validate = (data) => {
  const members_to_check = new Set([ 'type', 'title', 'detail', 'instance' ])

  for (const [key, value] of Object.entries(data)) {
    if ((members_to_check.has(key) && typeof value !== 'string') || value === undefined)
      delete data[key]
  }

  return data
}
