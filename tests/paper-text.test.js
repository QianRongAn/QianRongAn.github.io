import assert from 'node:assert/strict';
import { drawPaperLine } from '../journey/paper-text.js';

let calls = [];
const ctx = {
 measureText: text => ({ width: text.length * 10 }),
 fillText: (text, x, y) => calls.push({ text, x, y })
};
drawPaperLine(ctx, 'one two three', 10, 30, 200, true);
assert.equal(calls[0].x, 10);
assert.equal(calls.at(-1).x + 50, 210);
assert.ok(calls.every(call => call.y === 30));
calls = [];
drawPaperLine(ctx, 'last line', 10, 30, 200);
assert.deepEqual(calls, [{ text: 'last line', x: 10, y: 30 }]);
calls = [];
drawPaperLine(ctx, 'alone', 10, 30, 200, true);
assert.deepEqual(calls, [{ text: 'alone', x: 10, y: 30 }]);
console.log('Canvas justification checks passed');
