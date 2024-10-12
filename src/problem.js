import normalizeException from "normalize-exception"
import { error_instances } from "./instances.js"
import { validate } from "./utils.js"

/**
 * Create a Problem Instance from Problem Detail.
 * 
 * Requires a `status` to be passed in.
 * 
 * @param {number} status
 * @param {import("pijoy").ProblemDetail} [details] 
 * @returns {import("pijoy").ProblemInstance}
 */
export const pijoy = (status, details) => {
  if (!status) 
    throw new SyntaxError('A status must be passed in to `pijoy`.')
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
    ...details
  }

  return validate(problem_instance)
}

/**
 * Create a Problem factory, from custom Problem Details.
 * 
 * Requires each Problem Detail to have a `title`.
 */
export class Pijoy {
  /**
   * 
   * @param {import('pijoy').ProblemDetail[]} problems
   */
  constructor(problems) {
    if (!problems)
      throw new SyntaxError('Expected 1 argument for `Pijoy`, but got 0.')
    if (!Array.isArray(problems))
      throw new TypeError('Details must be an array.')
    if (problems.length === 0)
      throw new Error('Details array must have at least one element.')
    if (!problems.every(p => p.title))
      throw new TypeError('All details must have a `title`.')

    this.problems = problems
  }

  /**
   * Create a problem instance.
   * 
   * @param {string} title
   * @param {import('pijoy').ProblemDetail} [details]
   * @returns {import('pijoy').ProblemInstance}
   */
  create(title, details) {
    if (typeof title !== 'string')
      throw new TypeError('Title must be a string.')
    if (details && typeof details !== 'object')
      throw new TypeError('Passed-in details must be an object.')

    const problem = this.problems.find(p => p.title === title)

    /**
     * @type {import("pijoy").ProblemInstance}
     */
    const problem_instance = {
      status: problem?.status ?? 400,
      get type() { return details?.type ?? error_instances.find(i => i.status === this.status)?.type ?? 'about:blank' },
      title,
      ...problem,
      ...details
    }

    return validate(problem_instance)
  }
}

/**
 * Create a Problem Instance from an Error.
 * 
 * @param {any} error
 * @param {import("pijoy").ProblemDetail} [details] 
 * @returns {import("pijoy").ProblemInstance}
 */
export const pijoyFromError = (error, details) => {
  if (!error) 
    throw new SyntaxError('An error must be passed into `pijoyError`.')

  /**
   * @type {{ name: string, message: string, cause?: unknown, stack?: string } & 
   * { status?: number, code?: number, details?: import("pijoy").StickyProblemDetail } }
   */
  const { name, message, cause, stack, ...rest } = normalizeException(error)

  /**
   * @type {import("pijoy").ProblemInstance}
   */
  const problem_instance = {
    status: rest.status ?? rest.details?.status ?? details?.status ?? 400,
    get type() { return rest.details?.type ?? details?.type ?? error_instances.find(i => i.status === this.status)?.type ?? 'about:blank' },
    get title() { return name ?? details?.title ?? error_instances.find(i => i.status === this.status)?.title ?? 'Unknown Error' },
    detail: message,
    cause,
    code: rest.code,
    ...rest.details,
    ...details
  }

  return validate(problem_instance)
}
