/**
 * Test basic functionality.
 * 
 * Run with `bun run bun` or `npm run node`
 */

import { problem, Problem } from "./src/problem.js";
import { json } from "./src/json.js";

const pijo = problem({ status: 400 })
console.log('Minimal Problem Instance', pijo, '\n')

const db_response = {
  status: 403,
  message: 'You do not have enough credits.',
  errors: [ 'world', 'dolly' ],
  reason: 'NoWorky'
}

const pijoy = problem(db_response)
console.log('Problem Instance', pijoy, '\n')

const res = json(pijoy)
console.log('Problem Response', res, '\n')

console.log('Parsed Problem Response', await res.json(), '\n')

const instances = [
  {
    status: 402,
    type: 'https://example.com/errors/lack-of-credit',
    title: 'LackOfCredit',
    detail: 'You do not have enough credit in your account.'
  },
  {
    status: 403,
    type: 'https://example.com/errors/not-authorized',
    title: 'UnauthorizedAccountAccess',
    detail: 'You do not have authorization to access this account.'
  }
]

const prob = new Problem(instances)

const minp = prob.create('LackOfCredit')
console.log('Minimum Seeded Problem Instance', minp, '\n')

const p = prob.create('LackOfCredit', {
  instance: 'instance/path'
})
console.log('Seeded Problem Instance', p, '\n')

/* Should create console output. */
prob.create('UnauthorizedAccess', { title: 'Unauthorized' })

