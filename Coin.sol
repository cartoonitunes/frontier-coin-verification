// SPDX-License-Identifier: UNLICENSED
// Solidity source for Frontier Coin (0xFF2947 and 0x522A49)
// Deployed Sep 21–22 2015 (Frontier era)
// Compiled with: soljson-v0.1.1+commit.6ff4cd6.js (emscripten build, no optimizer)
// Runtime bytecode: 1648 bytes — exact match verified

contract Coin {
    mapping (address => uint) public balance;
    address public issuer;
    bytes32 public name;

    event CoinTransfer(address from, address to, uint256 amount);
    event CoinIssue(address issuer, address to, uint256 amount);

    function Coin(bytes32 _name) {
        issuer = msg.sender;
        name = _name;
    }

    function send(address account, uint amount) returns (uint) {
        if (balance[msg.sender] < amount) return 0;
        balance[msg.sender] -= amount;
        balance[account] += amount;
        CoinTransfer(msg.sender, account, amount);
        return 1;
    }

    function send(address account, uint amount, address exchange) returns (uint) {
        if (msg.sender != exchange) return 0;
        if (balance[exchange] < amount) return 0;
        balance[exchange] -= amount;
        balance[account] += amount;
        CoinTransfer(exchange, account, amount);
        return 1;
    }

    function issueCoin(address account, uint amount) returns (uint) {
        if (msg.sender != issuer) return 0;
        balance[account] += amount;
        CoinIssue(msg.sender, account, amount);
        return 1;
    }

    function changeIssuer(address newIssuer) returns (uint) {
        if (msg.sender != issuer) return 0;
        issuer = newIssuer;
        return 1;
    }
}
