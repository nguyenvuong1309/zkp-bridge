// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface IManager {
    function debit(
        uint256 _commitment,
        uint256 _dutyAmount
    ) external payable;
}

contract DAOWallet {

    IManager public manager;
    uint256 public commitment;

    uint256 public duty;

    constructor(address _manager, uint256 _commitment, uint256 _duty) {
        manager = IManager(_manager);
        commitment = _commitment;
        duty = _duty;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        (bool success, ) = payable(address(manager)).call{value: msg.value}("");
        require(success, "Failed to send Ether");
    }

}