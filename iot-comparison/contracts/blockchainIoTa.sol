// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract BlockchainIoTA {
    using ECDSA for bytes32;

    struct Device {
        address owner;
        string deviceId;
        bytes32 iotaPubKey;
        uint256 lastValue;
        uint256 timestamp;
    }

    mapping(string => Device) public devices;

    mapping(bytes32 => bool) public usedIotaMessages;

    address public oracle;

    uint256 public requiredConfirmations;

    event IotaVerified(string deviceId, bytes32 messageId, uint256 value);

    constructor(address _oracle, uint256 _confirmations) {
        oracle = _oracle;

        requiredConfirmations = _confirmations;
    }

    function registerDevice(string memory deviceId, bytes32 pubKey) public {
        devices[deviceId] = Device(msg.sender, deviceId, pubKey, 0, 0);
    }

    function verifyIotaData(
        string memory deviceId,
        uint256 value,
        bytes32 messageId,
        bytes32 bundleHash,
        uint256 confirmations,
        bytes memory signature
    ) public {
        require(msg.sender == oracle, "Only oracle");

        require(!usedIotaMessages[messageId], "Message already used");

        require(
            confirmations >= requiredConfirmations,
            "Insufficient confirmations"
        );

        bytes32 hash = keccak256(
            abi.encodePacked(
                deviceId,
                value,
                messageId,
                bundleHash,
                confirmations
            )
        );

        address signer = hash.recover(signature);

        require(
            bytes32(uint256(uint160(signer))) == devices[deviceId].iotaPubKey,
            "Invalid signature"
        );

        devices[deviceId].lastValue = value;

        devices[deviceId].timestamp = block.timestamp;

        usedIotaMessages[messageId] = true;

        emit IotaVerified(deviceId, messageId, value);
    }
}
