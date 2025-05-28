// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BlockchainIoTA {
    struct Device {
        address owner;
        string deviceId;
        bytes32 iotaProof;
        uint256 lastValue;
        uint256 timestamp;
    }

    mapping(string => Device) public devices;
    address public oracle;

    event IotaVerified(string deviceId, bytes32 proof, uint256 value);

    constructor(address _oracle) {
        oracle = _oracle;
    }

    function registerDevice(string memory deviceId) public {
        devices[deviceId] = Device(msg.sender, deviceId, bytes32(0), 0, 0);
    }

    function verifyIotaData(
        string memory deviceId,
        uint256 value,
        bytes32 proof
    ) public {
        require(msg.sender == oracle, "Only oracle");
        devices[deviceId].lastValue = value;
        devices[deviceId].timestamp = block.timestamp;
        devices[deviceId].iotaProof = proof;
        emit IotaVerified(deviceId, proof, value);
    }
}
