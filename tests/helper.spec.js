import { expect, test } from "vitest"
import { problem } from "../src/problem.js"
import { json } from "../src/json.js"

const problem_instance = problem(400)
const response = json(problem_instance)

test('Expect JSON response', () => {
  expect(response).toBeInstanceOf(Response)
})
