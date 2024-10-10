import { expect, test } from "vitest"
import { problem, Problem } from "../src/problem.js"

test('Create problem instance from status', () => {
  expect(problem(400)).toStrictEqual(
    {
      status: 400,
      type: "https://www.rfc-editor.org/rfc/rfc9110#name-400-bad-request",
      title: "Bad Request",
    }
  )
})

test('Create problem instances from json', () => {
  expect(problem(402, {
    type: "https://example.com/errors/lack-of-credit",
    title: "LackOfCredit",
    detail: "You do not have enough credit in your account.",
    instance: "https://site.example/logs/audit/135082985",
    balance: 30,
    cost: 50,
    accounts: [ "/account/12345", "/account/67890" ]
  })).toStrictEqual(
    {
      status: 402,
      type: "https://example.com/errors/lack-of-credit",
      title: "LackOfCredit",
      detail: "You do not have enough credit in your account.",
      instance: "https://site.example/logs/audit/135082985",
      balance: 30,
      cost: 50,
      accounts: [ "/account/12345", "/account/67890" ]
    }
  )
  expect(problem(420, {
    instance: "https://site.example/logs/audit/135082985"
  })).toStrictEqual(
    {
      status: 420,
      type: "about:blank",
      title: "Unknown Error",
      instance: "https://site.example/logs/audit/135082985"
    }
  )
  expect(problem(420, {
    title: "LackOfCredit",
    balance: 30,
    cost: 50,
    accounts: [ "/account/12345", "/account/67890" ]
  })).toStrictEqual(
    {
      status: 420,
      type: "about:blank",
      title: "LackOfCredit",
      balance: 30,
      cost: 50,
      accounts: [ "/account/12345", "/account/67890" ]
    }
  )
})

test('Throw SyntaxError for not passing in an argument to `problem()`', () => {
  expect(() => problem()).toThrowError('A status must be passed in to `problem`.')
})

test('Throw SyntaxError for not passing in errors to `new Problem()`', () => {
  expect(() => new Problem()).toThrowError('Expected 1 argument for `Problem`, but got 0.')
})

test('Throw TypeError for `status` not being a number', () => {
  expect(() => problem({ status: 'dud' })).toThrowError('Member `status` must be a number.')
})

test('Throw TypeError for `status` not being a number between 100 and 599', () => {
  expect(() => problem(99)).toThrowError('Member `status` must be a number in the range of 100-599.')
  expect(() => problem(600)).toThrowError('Member `status` must be a number in the range of 100-599.')
})

/* Some property names intentially have single or double quotes. */

const problems = new Problem([
  {
    "status": 402,
    type: "https://example.com/errors/lack-of-credit",
    title: "LackOfCredit",
    detail: "You do not have enough credit in your account."
  },
  {
    status: 403,
    "type": "https://example.com/errors/unauthorized-account-access",
    title: "UnauthorizedAccountAccess",
    'detail': "You do not have authorization to access this account."
  },
  {
    status: 403,
    "title": "UnauthorizedCredit",
    detail: "Credit authorization failed for payment method."
  }
])
const details = {
  "instance": "https://site.example/logs/audit/135082985",
  'balance': 30,
  cost: 50,
  accounts: [ "/account/12345", "/account/67890" ]
}

test('Create problem instances from custom errors', () => {
  expect(problems.create('LackOfCredit', { ...details })).toStrictEqual(
    {
      status: 402,
      type: "https://example.com/errors/lack-of-credit",
      'title': "LackOfCredit",
      "detail": "You do not have enough credit in your account.",
      "instance": "https://site.example/logs/audit/135082985",
      balance: 30,
      "cost": 50,
      "accounts": [ "/account/12345", "/account/67890" ]
    }
  )
  expect(problems.create('UnauthorizedAccountAccess', { ...details })).toStrictEqual(
    {
      status: 403,
      "type": "https://example.com/errors/unauthorized-account-access",
      title: "UnauthorizedAccountAccess",
      detail: "You do not have authorization to access this account.",
      instance: "https://site.example/logs/audit/135082985",
      balance: 30,
      'cost': 50,
      accounts: [ "/account/12345", "/account/67890" ]
    }
  )
  expect(problems.create('UnauthorizedCredit')).toStrictEqual(
    {
      "status": 403,
      type: "https://www.rfc-editor.org/rfc/rfc9110#name-403-forbidden",
      title: "UnauthorizedCredit",
      detail: "Credit authorization failed for payment method."
    }
  )
  expect(problems.create('Unknown', { instance: "https://site.example/logs/audit/135082985" })).toStrictEqual(
    {
      status: 400,
      type: "https://www.rfc-editor.org/rfc/rfc9110#name-400-bad-request",
      title: "Unknown",
      'instance': "https://site.example/logs/audit/135082985"
    }
  )
  expect(problems.create('CustomError', { status: 420, instance: "https://site.example/logs/audit/135082985" })).toStrictEqual(
    {
      status: 420,
      type: "about:blank",
      title: "CustomError",
      instance: "https://site.example/logs/audit/135082985"
    }
  )
})

test('Throw TypeError for `title` not being a string', () => {
  expect(() => problems.create(1)).toThrowError('Title must be a string.')
})

test('Throw TypeError for `details` not being an object', () => {
  expect(() => problems.create('Error', 'Bad')).toThrowError('Passed-in details must be an object.')
})
