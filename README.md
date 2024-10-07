# pijoy

Create standardized Javascript objects for API error responses, per [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457); which obsoletes [RFC 7807](https://www.rfc-editor.org/rfc/rfc7807)

Pronounced "Pie Joy", the name is an acronym for _Problem Instance Javascript Object Yo!_.

## Why pijoy?

- Easily create API error responses.
- No need to come up with your own format.
- Get started by just passing in an HTTP status code.
- Customize with your own errors.
- Interoperability with other systems that use the standard.

## Definitions

"problem details" - An RFC-defined JSON format that provides actionable information about errors returned from an API.

"problem instance" - A specific instance of a problem detail, with a few guaranteed pieces of information.

## RFC Explainer

If you're new to this concept, below are a few snippets from the RFC. Embedded links have been removed.

"This document defines a "problem detail" to carry machine-readable details of errors in HTTP response content to avoid the need to define new error response formats for HTTP APIs.

HTTP status codes (Section 15 of HTTP) cannot always convey enough information about errors to be helpful.

To address that shortcoming, this specification defines simple JSON and XML document formats to describe the specifics of a problem encountered -- "problem details".

For example, consider a response indicating that the client's account doesn't have enough credit. The API's designer might decide to use the 403 Forbidden status code to inform generic HTTP software (such as client libraries, caches, and proxies) of the response's general semantics. API-specific problem details (such as why the server refused the request and the applicable account balance) can be carried in the response content so that the client can act upon them appropriately (for example, triggering a transfer of more credit into the account)."

## Install

`npm install pijoy`

## Usage

The defined [members](https://www.rfc-editor.org/rfc/rfc9457#name-members-of-a-problem-detail) of a problem detail are `type`, `status`, `title`, `detail`, and `instance`. The rest are [extension members](https://www.rfc-editor.org/rfc/rfc9457#name-extension-members), whose names you define.

The Content-Type for responses must be `application/problem+json`; which is set in the pijoy `json` function, if you choose to use it.

### Minimal Example
Pijoy returns a problem instance based on the status code you pass in.

```js
import { problem, json } from "pijoy"

/* Create a Problem Instance. */
const problem_instance = problem({ status: 403 })

/* Return a JSON response. */
return json(problem_instance)
```

```json
{
  "status": 403,
  "type": "https://www.rfc-editor.org/rfc/rfc9110#name-403-forbidden",
  "title": "Forbidden"
}
```

### Example with custom errors
Use your own errors, and we will match against them using the `title`. Therefore, the title of each must be unique across all errors.

```js
/* lib/errors.js */

import { Problem } from "pijoy"

const errors = [
  {
    status: 402,
    type: "https://example.com/errors/lack-of-credit",
    title: "LackOfCredit",
    detail: "You do not have enough credit in your account."
  },
  {
    status: 403,
    type: "https://example.com/errors/unauthorized-account-access",
    title: "UnauthorizedAccountAccess",
    detail: "You do not have authorization to access this account."
  },
  {
    status: 403,
    type: "https://example.com/errors/unauthorized-credit",
    title: "UnauthorizedCredit",
    detail: "Credit authorization failed for payment method."
  }
]

export const problem = new Problem(errors)
```
```js
/* API endpoint to purchase a product. */
import { problem } from "./lib/errors.js"
import { json } from "pijoy"

export const POST = async ({ request }) => {
  const { data, error } = someFunctionorFetch(request)

  if (error) {
    /* Assumes `error` has a `name` property that matches the `title` of a custom error above. e.g. LackOfCredit */
    /* If passing in additional details (optional), you'll want to destucture the property that would be used for the value of `instance`, if it exists. */ 
    const { name, audit_log_path, ...rest } = error

    const problem_instance = problem.create(name, {
      instance: audit_log_path,
      ...rest
     })

    return json({ data: null, error: problem_instance })
  }

  ...
}
```
```json
{
  "status": 402,
  "type": "https://example.com/errors/lack-of-credit",
  "title": "LackOfCredit",
  "detail": "You do not have enough credit in your account.",
  "instance": "https://site.example/logs/audit/135082985",
  "balance": 30,
  "cost": 50,
  "accounts": [ "/account/12345", "/account/67890" ]
}
```

## Definitions and Types

### Problem Detail Members

It's important to note that none of the RFC-defined members are required, but this library ensures that `type`, `status`, and `title` are all present within a problem instance. If you use your own errors, each one must define a value for these three properties.

> The below definitions are based on the RFC, but may contain different links and slightly different verbiage.

[`status`](https://www.rfc-editor.org/rfc/rfc9457#name-status) - A number indicating a valid [HTTP status code](https://www.rfc-editor.org/rfc/rfc9110#name-status-codes), for this occurrence of the problem. This member is only advisory, is used for the convenience of the consumer, and if present, must be used in the actual HTTP response.

[`type`](https://www.rfc-editor.org/rfc/rfc9457#name-type) - A string containing a [URI](https://www.rfc-editor.org/rfc/rfc3986.html#page-7) reference that identifies the problem type. If you pass in an HTTP status code to `status` that isn't defined in [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#name-status-codes), and don't also pass in this member, pijoy sets `type` to "about:blank".

[`title`](https://www.rfc-editor.org/rfc/rfc9457#name-title) - A string containing a short, human-readable summary of the problem type. This member is only advisory. If you pass in a valid HTTP status code to `status`, that isn't defined in [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110#name-status-codes), and don't also pass in this member, pijoy sets `title` to "Unknown Error".

[`detail`](https://www.rfc-editor.org/rfc/rfc9457#name-detail) - A string containing a human-readable explanation specific to this occurrence of the problem. This member, if present, ought to focus on helping the client correct the problem, rather than giving debugging information.

[`instance`](https://www.rfc-editor.org/rfc/rfc9457#name-instance) - A string containing a [URI](https://www.rfc-editor.org/rfc/rfc3986.html#page-7) reference that identifies this specific occurrence of the problem. This is typically a path to a log or other audit trail for debugging, and it is recommended to be an absolute URI.

### Types
```ts
type ProblemDetail = {
  status?: number;
  type?: string;
  title?: string;
  detail?: string;
  instance?: string;
  [key:string]: any;
}

type ProblemInstance = {
  status: number;
  type: string;
  title: string;
  detail?: string;
  instance?: string;
  [key:string]: any;
}
```

## API

`problem()` - Create a Problem Instance.
```ts
/* At a minimum, an HTTP status must be passed in. */
function problem(data: ProblemDetail & { status: number }): ProblemInstance
```

`json()` - Create a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response). This includes a `Content-Type` header set to `application/problem+json`, and also a `Content-Length` header.
```ts
function json(data: ProblemInstance): Response
```

`Problem` - Create a Problem factory. It's recommended to export `problem` from a file, where you can import it into other files to create instances. `errors` is of type `ProblemInstance[]`, and `title` is a `string`.
```ts
const problem = new Problem(errors)
const instance = problem.create(title)
```
