import { error_instances } from "./instances.js"
import { validate } from "./utils.js"

/**
 * Create a Problem Instance from Problem Detail.
 * 
 * Requires a `status` to be passed in.
 * 
 * @param {number} status
 * @param {import("pijoy").ProblemDetail} [data] 
 * @returns {import("pijoy").ProblemInstance}
 */
export const problem = (status, data) => {
  if (!status) 
    throw new SyntaxError('A status must be passed in to `problem`.')
  if (typeof status !== 'number') 
    throw new TypeError('Member `status` must be a number.')
  if (status && (status < 100 || status > 599)) 
    throw new TypeError('Member `status` must be a number in the range of 100-599.')

  /**
   * @type {import("pijoy").ProblemInstance}
   */
  const problem_instance = {
    status,
    get type() { return error_instances.find(i => i.status === status)?.type ?? 'about:blank' },
    get title() { return error_instances.find(i => i.status === status)?.title ?? 'Unknown Error' },
    ...data
  }

  return validate(problem_instance)
}

/**
 * Create a Problem factory, from custom Problem Details.
 * 
 * Requires each Problem Detail to have a `title`.
 */
export class Problem {
  /**
   * 
   * @param {import('pijoy').ProblemDetail[]} details
   */
  constructor(details) {
    if (!details)
      throw new SyntaxError('Expected 1 argument for `Problem`, but got 0.')
    if (!Array.isArray(details))
      throw new TypeError('Details must be an array.')
    if (details.length === 0)
      throw new Error('Details array must have at least one element.')
    if (!details.every(d => d.title))
      throw new TypeError('All details must have a `title`.')

    this.details = details
  }

  /**
   * Create a problem instance.
   * 
   * @param {string} title
   * @param {import('pijoy').ProblemDetail} [data]
   * @returns {import('pijoy').ProblemInstance}
   */
  create(title, data) {
    if (typeof title !== 'string')
      throw new TypeError('Title must be a string.')
    if (data && typeof data !== 'object')
      throw new TypeError('Passed-in data must be an object.')

    const detail = this.details.find(d => d.title === title)

    /**
     * @type {import("pijoy").ProblemInstance}
     */
    const problem_instance = {
      status: detail?.status ?? 400,
      get type() { return error_instances.find(i => i.status === this.status)?.type ?? 'about:blank' },
      title,
      ...detail,
      ...data
    }

    return validate(problem_instance)
  }
}
