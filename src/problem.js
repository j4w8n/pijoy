import { http_codes } from "./http_codes.js"
import { validate } from "./utils.js"

/**
 * Create a Problem Instance.
 * 
 * @param {import("pijoy").ProblemDetail & { status: number }} data 
 * @returns {import("pijoy").ProblemInstance}
 */
export const problem = (data) => {
  const { status, type, title, detail, instance, ...rest } = data

  /* Ensure status exists and is valid. */
  if (!status) throw new TypeError('Member `status` must be passed into `problem()`.')
  if (typeof status !== 'number') throw new TypeError('Member `status` must be a number.')
  if (status < 100 || status > 599) throw new TypeError('Member `status` must be a number in the range of 100-599.')
  
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

/**
 * Create a Problem class.
 * 
 * Requires an array of problem types.
 */
export class Problem {
  /**
   * 
   * @param {import('pijoy').ProblemInstance[]} seeds
   */
  constructor(seeds) {
    if (!Array.isArray(seeds))
      throw new TypeError('Seeds must be an array.')
    if (seeds.length === 0)
      throw new Error('Seeds array must have at least one element.')
    if (!seeds.every(e => e.status && e.type && e.title))
      throw new TypeError('All seeds must be of type ProblemInstance, with a `status`, `type`, and `title`.')

    this.seeds = seeds
  }

  /**
   * Create a problem instance.
   * 
   * @param {string} title
   * @param {import('pijoy').ProblemDetail} [detail]
   * @returns {import('pijoy').ProblemInstance}
   */
  create(title, detail) {
    if (typeof title !== 'string')
      throw new TypeError('Title must be a string.')
    if (detail && typeof detail !== 'object')
      throw new TypeError('Details must be an object.')
    if (detail?.title)
      console.info('Found `title` in detail. This will override your passed-in `title`. Did you mean to do this?')

    const pi = this.seeds.find(s => s.title === title) ?? { status: 400, type: 'about:blank', title }

    return {
      ...pi,
      ...detail
    }
  }
}