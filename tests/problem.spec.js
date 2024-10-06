import { expect, test } from "vitest"
import { problem, Problem } from "../src/problem.js"
import { json } from "../src/json.js"

test('Create simple problem instance', () => {
  expect(problem({ status: 400 })).toStrictEqual(
    {
      status: 400,
      type: "https://www.rfc-editor.org/rfc/rfc9110#name-400-bad-request",
      title: "Bad Request",
    }
  )
})

test('To throw error for not passing in `status`', () => {
  expect(problem()).toThrowError('Member `status` must be passed into `problem()`.')
})

test('Create problem instances from custom errors', () => {
  const problem = new Problem([
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
  ])
  const error = {
    "instance": "https://site.example/logs/audit/135082985",
    "balance": 30,
    "cost": 50,
    "accounts": [ "/account/12345", "/account/67890" ]
  }
  expect(problem.create('LackOfCredit', { ...error })).toStrictEqual(
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
  )
  expect(problem.create('UnauthorizedAccountAccess', { ...error })).toStrictEqual(
    {
      "status": 403,
      "type": "https://example.com/errors/unauthorized-account-access",
      "title": "UnauthorizedAccountAccess",
      "detail": "You do not have authorization to access this account.",
      "instance": "https://site.example/logs/audit/135082985",
      "balance": 30,
      "cost": 50,
      "accounts": [ "/account/12345", "/account/67890" ]
    }
  )
})

test('')
