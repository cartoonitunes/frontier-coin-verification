# Frontier Coin — Bytecode Verification

Proof of source code for two identical Frontier-era Ethereum contracts:

- [`0xFF2947b1851bB16a7C8E71C6a8458D29600F9D6a`](https://ethereumhistory.com/contract/0xFF2947b1851bB16a7C8E71C6a8458D29600F9D6a) — deployed Sep 21 2015 (block ~117,000 era)
- [`0x522A493D563B0189c76877382b33F4c8C842922c`](https://ethereumhistory.com/contract/0x522A493D563B0189c76877382b33F4c8C842922c) — deployed Sep 22 2015

Both contracts have **identical runtime bytecode** (1648 bytes). This repo reproduces that bytecode exactly from source.

## Contract

A Frontier-era subcurrency (coin) implementing a dual-send pattern: direct transfers plus exchange-authorized transfers. Based on the early Ethereum subcurrency tutorial but with:

- `bytes32` name field (not `string`) — pre-string-encoding era
- Two `send()` overloads: basic and exchange-delegated
- All non-view functions return `uint` (0=fail, 1=success) — no reverts or booleans
- `CoinTransfer` and `CoinIssue` events (non-standard, pre-ERC-20)
- Exchange-authorized send: `msg.sender` must equal the `exchange` parameter — prevents unauthorized on-behalf transfers

## Compiler

| Field | Value |
|---|---|
| **Compiler** | `soljson-v0.1.1+commit.6ff4cd6.js` |
| **Build** | Emscripten/JavaScript (not native C++) |
| **Optimizer** | OFF (default, no `--optimize`) |
| **Runtime size** | 1648 bytes |

Download from: https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js

> **Note:** The native C++ build of v0.1.1 (commit 858e7b8) produces different bytecode due to different getter ordering from pointer comparison (`set<Declaration*>` uses pointer addresses, which differ between JS heap and C++ heap allocations). The emscripten JS build is required for an exact match.

## Verification

```bash
# Download compiler
curl -O https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js

# Verify
node verify.js
```

Expected output: `✅ EXACT MATCH — bytecode verified!`

## Key Insights

1. **Emscripten build required** — getter ordering (`balance` before `issuer` before `name`) is determined by JS heap allocation order, not C++ `set<>` pointer ordering
2. **`bytes32 public name`** — not `string`; just a 32-byte SLOAD, no dynamic encoding overhead
3. **PUSH29/DIV dispatch** — the 2015 selector dispatch style (no EXP shorthand); consistent with no-optimizer flag
4. **Exchange pattern** — `send(address, uint, address exchange)` requires the caller to BE the exchange; protects against unauthorized delegation
5. **Storage layout**: slot 0 = balance mapping, slot 1 = issuer address (packed), slot 2 = name (bytes32)

## Files

- `Coin.sol` — Solidity source
- `runtime.hex` — Expected runtime bytecode (1648 bytes)
- `verify.js` — Verification script
