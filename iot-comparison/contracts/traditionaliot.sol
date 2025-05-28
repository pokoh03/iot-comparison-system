// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract TraditionalIoT {
    struct Device {
        address owner;
        string deviceId;
        uint256 lastValue;
        uint256 timestamp;
    }

    mapping(string => Device) public devices;

    event DataRecorded(string deviceId, uint256 value, uint256 timestamp);

    function registerDevice(string memory deviceId) public {
        devices[deviceId] = Device(msg.sender, deviceId, 0, block.timestamp);
    }

    function recordData(string memory deviceId, uint256 value) public {
        require(devices[deviceId].owner == msg.sender, "Unauthorized");
        devices[deviceId].lastValue = value;
        devices[deviceId].timestamp = block.timestamp;
        emit DataRecorded(deviceId, value, block.timestamp);
    }
}
