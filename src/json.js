/**
 * Create a JSON `Response` using the Fetch API `Response.json()` static method.
 * Use `Response()` as a fallback.
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Response/json_static)
 * 
 * @param {import('pijoy').ProblemInstance} data
 * @param {ResponseInit} [init]
 * @returns {Response}
 */
export const json = (data, init) => {
  const body = JSON.stringify(data)
  const headers = new Headers(init?.headers)

  if (!headers.has('content-length'))
    headers.set('content-length', new TextEncoder().encode(body).byteLength.toString())
  
  headers.set('content-type', 'application/problem+json')

  const options = {
    status: data.status ?? init?.status ?? 200,
    statusText: init?.statusText ?? '',
    headers
  }

  if (typeof Response.json !== 'undefined')
    return Response.json(data, options)

  /* Deprecate when json static method is widely supported. */
  return new Response(body, options)
}
