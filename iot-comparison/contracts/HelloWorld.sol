// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;



contract HelloWorld {
    string private value;

    function store(string memory newValue) public {
        value = newValue;
    }

    function retrieve() public view returns (string memory) {
        return value;
    }
}
