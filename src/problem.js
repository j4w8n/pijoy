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
