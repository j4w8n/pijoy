declare module 'pijoy' {
  export type ProblemInstance = {
    status: number;
    type: string;
    title: string;
    detail?: string;
    instance?: string;
    [key: string]: any;
  }

  export type ProblemDetail<T = {}> = {
    status?: number;
    type?: string;
    title?: string;
    detail?: string;
    instance?: string;
    [key: string]: any;
  } & T

  /**
   * Create a JSON `Response` using the Fetch API `Response.json()` static method.
   * Use `Response()` as a fallback.
   * 
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Response/json_static))
   */
  export function json(data: ProblemInstance, init?: ResponseInit): Response

  /**
   * Create a Problem Instance from Problem Detail.
   * 
   * Requires a `status` to be passed in.
   */
  export function problem(status: number, details: ProblemDetail): ProblemInstance

  /**
   * Create a Problem factory, from custom Problem Details.
   * 
   * Requires each Problem Detail to have a `title`.
   */
  export class Problem {
    constructor(problems: ProblemDetail<{ title: string; }>[])
    create(title: string, details?: ProblemDetail): ProblemInstance
  }
}
