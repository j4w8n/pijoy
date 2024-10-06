# pijoy

Create standardized Javascript objects for API error responses, per [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457).

Pronounced "Pie Joy", the name is an acronym for _Problem Instance Javascript Object Yo!_. I took some poetic license from the RFC verbiage "problem details", to arrive at "problem instance".

> The original name was "pijo", but the NPM registry rejected that on the basis it was too much like the existing package "pino". Good. I already have another package that ends in y for "yo!".

"problem details" - One or more Javascript object key/value pairs, that provide details about API request errors. Some, or all, of which are defined by RFC 9457.

"problem instance" - A Javascript object consisting of problem details.

## RFC Explainer

If you're new to this concept, below are a few snippets from the RFC. Embedded links have been removed.

"This document defines a "problem detail" to carry machine-readable details of errors in HTTP response content to avoid the need to define new error response formats for HTTP APIs.

HTTP status codes (Section 15 of HTTP) cannot always convey enough information about errors to be helpful.

To address that shortcoming, this specification defines simple JSON and XML document formats to describe the specifics of a problem encountered -- "problem details".

For example, consider a response indicating that the client's account doesn't have enough credit. The API's designer might decide to use the 403 Forbidden status code to inform generic HTTP software (such as client libraries, caches, and proxies) of the response's general semantics. API-specific problem details (such as why the server refused the request and the applicable account balance) can be carried in the response content so that the client can act upon them appropriately (for example, triggering a transfer of more credit into the account)."

## Install

`npm install pijoy`

## Usage

The defined [members](https://www.rfc-editor.org/rfc/rfc9457#name-members-of-a-problem-detail) of a problem instance are `type`, `status`, `title`, `detail`, and `instance`. The rest are [extension members](https://www.rfc-editor.org/rfc/rfc9457#name-extension-members), whose names you define.

The Content-Type for responses must be `application/problem+json`; which is set in the pijoy `json` function, if you choose to use it.

### Minimal Example
```js
import { problem, json } from "pijoy"

/* Create a Problem Instance */
const pijoy = problem({ status: 403 })

/* Return a JSON response with headers */
return json(pijoy)
```

```json
{
  "type": "https://www.rfc-editor.org/rfc/rfc9110#name-403-forbidden",
  "status": 403,
  "title": "Forbidden"
}
```

### Real-World-ish Example
```js
import { problem, json } from "pijoy"

/* API endpoint to purchase a product */
export const POST = async ({ request }) => {

  const res = await fetch("http://db.example.com")
  const { data, error } = await res.json()

  if (error) {
    const pijoy = createPijoy(error)
    return json({ data: null, error: pijoy })
  }

  function createPijoy(error) {
    /* Assuming your database server returns these items */
    const { status, message, ...rest } = error

    return problem({ 
      status, // 403
      detail: message, // "You do not have enough credit to purchase this item."
      instance: request.url, // "https://example.com/product/1234"
      ...rest // { reason: "LackOfCredit", balance: 30, cost: 50, accounts: [ "/account/12345", "/account/67890" ] }
    })
  }
}
```
```json
{
  "type": "https://www.rfc-editor.org/rfc/rfc9110#name-403-forbidden",
  "status": 403,
  "title": "Forbidden",
  "detail": "You do not have enough credits to purchase this item.",
  "instance": "http://example.com/product/1234",
  "reason": "LackOfCredit",
  "balance": 30,
  "cost": 50,
  "accounts": [ "/account/12345", "/account/67890" ]
}
```

## Definitions and Types

### Problem Detail Members

It's important to note that none of the RFC-defined members are required, but this library ensures that `type`, `status`, and `title` are all present within a problem instance.

> The below definitions are based on the RFC, but may contain different links and slightly different verbiage.

[`type`](https://www.rfc-editor.org/rfc/rfc9457#name-type) - A string containing a [URI](https://www.rfc-editor.org/rfc/rfc3986.html#page-7) reference that identifies the problem type. If you pass in an HTTP status code to `status` that isn't defined in [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#name-status-codes), and don't also pass in this member, pijoy sets `type` to "about:blank".

[`status`](https://www.rfc-editor.org/rfc/rfc9457#name-status) - A number indicating a valid [HTTP status code](https://www.rfc-editor.org/rfc/rfc9110#name-status-codes), for this occurrence of the problem. This member is only advisory, is used for the convenience of the consumer, and if present, must be used in the actual HTTP response.

[`title`](https://www.rfc-editor.org/rfc/rfc9457#name-title) - A string containing a short, human-readable summary of the problem type. This member is only advisory. If you pass in a valid HTTP status code to `status`, that isn't defined in [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#name-status-codes), and don't also pass in this member, pijoy sets `title` to "Unknown Error".

[`detail`](https://www.rfc-editor.org/rfc/rfc9457#name-detail) - A string containing a human-readable explanation specific to this occurrence of the problem. This member, if present, ought to focus on helping the client correct the problem, rather than giving debugging information.

[`instance`](https://www.rfc-editor.org/rfc/rfc9457#name-instance) - A string containing a [URI](https://www.rfc-editor.org/rfc/rfc3986.html#page-7) reference that identifies this specific occurrence of the problem. This is typically a path to a log or other audit trail for debugging, and it is recommended to be an absolute URI.

### Library Functions

> `HttpStatusCodes` is a number range between 100-599. `[key:string]: any` implies any number of additional [extension members](https://www.rfc-editor.org/rfc/rfc9457#name-extension-members) you wish to include.

`problem()` - Create a Problem Instance.
```ts
function problem(data: ProblemDetail): ProblemInstance

ProblemDetail = {
  status: HttpStatusCodes;
  type?: string;
  title?: string;
  detail?: string;
  instance?: string;
  [key:string]: any;
}

ProblemInstance = {
  type: string;
  status: HttpStatusCodes;
  title: string;
  detail?: string;
  instance?: string;
  [key:string]: any;
}
```

`json()` - Create a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response). This includes a `Content-Type` header set to `application/problem+json`, and also a `Content-Length` header.
```ts
function json(data: ProblemInstance): Response

ProblemInstance = {
  type: string;
  status: HttpStatusCodes;
  title: string;
  detail?: string;
  instance?: string;
  [key:string]: any;
}
```
