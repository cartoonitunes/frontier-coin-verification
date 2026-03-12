#!/usr/bin/env node
// Verification script for Frontier Coin bytecode
// Requires: soljson-v0.1.1+commit.6ff4cd6.js from https://binaries.soliditylang.org/bin/

const fs = require('fs');
const path = require('path');

// Download soljson if not present
const SOLJSON = path.join(__dirname, 'soljson-v0.1.1+commit.6ff4cd6.js');
if (!fs.existsSync(SOLJSON)) {
    console.error('Please download soljson-v0.1.1+commit.6ff4cd6.js from:');
    console.error('https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js');
    process.exit(1);
}

const solc = require(SOLJSON);
const source = fs.readFileSync(path.join(__dirname, 'Coin.sol'), 'utf8');

const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
const result = JSON.parse(compile(source, 0)); // 0 = no optimizer
if (result.errors) { console.error('Errors:', result.errors); process.exit(1); }

const fullBytecode = result.contracts.Coin.bytecode;
const f300idx = fullBytecode.indexOf('f300');
const runtime = f300idx >= 0 ? fullBytecode.substring(f300idx + 4) : '';

const EXPECTED = fs.readFileSync(path.join(__dirname, 'runtime.hex'), 'utf8').trim();

console.log('Compiled runtime:', runtime.length/2, 'bytes');
console.log('Expected runtime:', EXPECTED.length/2, 'bytes');

if (runtime === EXPECTED) {
    console.log('\n✅ EXACT MATCH — bytecode verified!');
} else {
    console.log('\n❌ MISMATCH');
    process.exit(1);
}
