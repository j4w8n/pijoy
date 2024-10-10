import { expect, test } from "vitest"
import { pijoy } from "../src/problem.js"
import { problem } from "../src/helpers.js"

const problem_instance = pijoy(400)
const response = problem(problem_instance)

test('Expect JSON response', () => {
  expect(response).toBeInstanceOf(Response)
})
