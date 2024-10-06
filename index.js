/**
 * Test basic functionality.
 * 
 * Run with `bun run bun` or `npm run node`
 */

import { problem } from "./src/problem.js";
import { json } from "./src/json.js";

const db_response = {
  status: 403,
  message: 'You do not have enough credits.',
  errors: [ 'world', 'dolly' ],
  reason: 'NoWorky'
}

const pijoy = problem(db_response)
console.log("Problem Instance", pijoy, '\n')

const res = json(pijoy)
console.log(res, '\n')

console.log("Parsed JSON", await res.json(), '\n')
