/**
 * Test basic functionality.
 * 
 * Run with `bun run bun` or `npm run node`
 */

import { problem } from "./src/problem.js";
import { json } from "./src/json.js";

const pijo = problem({
  status: 403,
  reason: 'LackOfCredit',
  balance: 30,
  account: [ 'account/12345' ]
})
console.log("Problem Instance", pijo, '\n')

const res = json(pijo)
console.log(res, '\n')

console.log("Parsed JSON", await res.json(), '\n')
