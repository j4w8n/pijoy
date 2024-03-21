declare module 'pijoy' {
  export type ProblemInstance = {
    type: string;
    status: HttpStatusCodes;
    title: string;
    detail?: string;
    instance?: string;
    [key:string]: any;
  }

  export type ProblemDetail = {
    status: HttpStatusCodes;
    type?: string;
    title?: string;
    detail?: string;
    instance?: string;
    [key:string]: any;
  }

  /* Begin credit: https://dev.to/tylim88/typescript-numeric-range-type-15a5#comment-22mld */
  type NumericRange<
    START extends number,
    END extends number,
    ARR extends unknown[] = [],
    ACC extends number = never
  > = ARR['length'] extends END
    ? ACC | START | END
    : NumericRange<START, END, [...ARR, 1], ARR[START] extends undefined ? ACC : ACC | ARR['length']>
  /* End credit */
    
  export type HttpStatusCodes = NumericRange<100,599>

  /**
   * Create a JSON `Response` using the Fetch API `Response.json()` static method.
   * Use `Response()` as a fallback.
   * 
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Response/json_static))
   */
  export function json(data: ProblemInstance, init?: ResponseInit): Response

  /**
   * Create a Problem Instance.
   */
  export function problem(data: ProblemDetail): ProblemInstance
}
