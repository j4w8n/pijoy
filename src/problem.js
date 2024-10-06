import { http_codes } from "./http_codes.js"
import { validate } from "./utils.js"

/**
 * Create a Problem Instance.
 * 
 * @param {import("pijoy").ProblemDetail} data 
 * @returns {import("pijoy").ProblemInstance}
 */
export const problem = (data) => {
  const { status, type, title, detail, instance, ...rest } = data

  /* Ensure status exists and is valid. */
  if (!status) throw new Error('Member `status` must be passed into `problem()`.')
  if (typeof status !== 'number') throw new Error('Member `status` must be a number.')
  if (status < 100 || status > 599) throw new Error('Member `status` must be a number in the range of 100-599.')
  
  const code = http_codes.find(c => c.status === status) ?? { type: 'about:blank', title: 'Unknown Error' }

  /**
   * @type {import("pijoy").ProblemInstance}
   */
  const problem_instance = {
    status,
    type: type ?? code.type,
    title: title ?? code.title,
    detail,
    instance,
    ...rest
  }

  return validate(problem_instance)
}
