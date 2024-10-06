declare module 'pijoy' {
  export type ProblemInstance = {
    status: number;
    type: string;
    title: string;
    detail?: string;
    instance?: string;
    [key: string]: any;
  }

  export type ProblemDetail = {
    status?: number;
    type?: string;
    title?: string;
    detail?: string;
    instance?: string;
    [key: string]: any;
  }

  /**
   * Create a JSON `Response` using the Fetch API `Response.json()` static method.
   * Use `Response()` as a fallback.
   * 
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Response/json_static))
   */
  export function json(data: ProblemInstance, init?: ResponseInit): Response

  /**
   * Create a Problem Instance from Problem Detail.
   */
  export function problem(data: ProblemDetail & { status: number }): ProblemInstance

  /**
   * Create a Problem factory, from custom Problem Instances.
   */
  export class Problem {
    constructor(instances: ProblemInstance[])
    create(title: string, detail?: ProblemDetail): ProblemInstance
  }
}
