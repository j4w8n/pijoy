import { expect, test } from "vitest"
import { problem, Problem } from "../src/problem.js"

test('Create simple problem instance', () => {
  expect(problem({ status: 400 })).toStrictEqual(
    {
      status: 400,
      type: "https://www.rfc-editor.org/rfc/rfc9110#name-400-bad-request",
      title: "Bad Request",
    }
  )
})

test('Throw SyntaxError for not passing in an argument to `problem()`', () => {
  expect(() => problem()).toThrowError('Expected 1 argument for `problem`, but got 0.')
})

test('Throw TypeError for not passing in `status` to `problem()`', () => {
  expect(() => problem({})).toThrowError('Member `status` must be passed into `problem()`.')
})

test('Throw TypeError for `status` not being a number', () => {
  expect(() => problem({ status: 'dud' })).toThrowError('Member `status` must be a number.')
})

test('Throw TypeError for `status` not being a number between 100 and 599', () => {
  expect(() => problem({ status: 99 })).toThrowError('Member `status` must be a number in the range of 100-599.')
  expect(() => problem({ status: 600 })).toThrowError('Member `status` must be a number in the range of 100-599.')
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
