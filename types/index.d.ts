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

  export type StickyProblemDetail = {
    status?: number;
    type?: string;
    title?: string;
  }

  /**
   * Create a JSON `Response` using the Fetch API `Response.json()` static method.
   * Use `Response()` as a fallback.
   * 
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Response/json_static))
   */
  export function problem(data: ProblemInstance, init?: ResponseInit): Response

  /**
   * Create a Problem Instance from a status code or Error.
   */
  export function pijoy(arg: number | Error, details: ProblemDetail): ProblemInstance

  /**
   * Create a Problem factory, from custom Problem Details.
   * 
   * Requires each Problem Detail to have a `title`.
   */
  export class Pijoy {
    constructor(problems: ProblemDetail<{ title: string; }>[])
    create(title: string, details?: ProblemDetail): ProblemInstance
  }
}
