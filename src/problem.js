import { error_instances } from "./instances.js"
import { validate } from "./utils.js"

/**
 * Create a Problem Instance from Problem Detail.
 * 
 * @param {import("pijoy").ProblemDetail & { status: number }} data 
 * @returns {import("pijoy").ProblemInstance}
 */
export const problem = (data) => {
  if (!data)
    throw new SyntaxError('Expected 1 argument for `problem`, but got 0.')

  const { status, type, title, detail, instance, ...rest } = data

  /* Ensure status exists and is valid. */
  if (!status) throw new TypeError('Member `status` must be passed into `problem()`.')
  if (typeof status !== 'number') throw new TypeError('Member `status` must be a number.')
  if (status < 100 || status > 599) throw new TypeError('Member `status` must be a number in the range of 100-599.')
  
  const code = error_instances.find(i => i.status === status) ?? { type: 'about:blank', title: 'Unknown Error' }

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
 * Create a Problem factory, from custom Problem Instances.
 */
export class Problem {
  /**
   * 
   * @param {import('pijoy').ProblemInstance[]} instances
   */
  constructor(instances) {
    if (!Array.isArray(instances))
      throw new TypeError('Instances must be an array.')
    if (instances.length === 0)
      throw new Error('Instances array must have at least one element.')
    if (!instances.every(e => e.status && e.type && e.title))
      throw new TypeError('All instances must be of type ProblemInstance, with a `status`, `type`, and `title`.')

    this.instances = instances
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

    const instance = this.instances.find(i => i.title === title) ?? { status: 400, type: 'about:blank', title }
    const problem_instance = {
      ...instance,
      ...detail
    }

    return validate(problem_instance)
  }
}
