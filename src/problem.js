import { http_codes } from "./http_codes.js"
import { validate } from "./utils.js"

/**
 * Create a Problem Instance.
 * 
 * @param {import("pijoy").ProblemDetail} data 
 * @returns {import("pijoy").ProblemInstance}
 */
export const problem = (data) => {
  validate(data)

  const { status, ...rest } = data
  const code = http_codes.find(c => c.status === status) ?? { type: 'about:blank', title: 'Unknown Error' }

  return {
    type: code.type,
    status,
    title: code.title,
    ...rest
  }
}
