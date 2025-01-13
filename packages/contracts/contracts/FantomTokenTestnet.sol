// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FTMTransfer
 * @dev Simple smart contract to transfer FTM on the Fantom Testnet
 */
contract FTMTransfer {
    address public owner;

    // Event when FTM is received
    event TransferReceived(address indexed from, uint256 amount);
    // Event when FTM is sent
    event TransferSent(address indexed from, address indexed to, uint256 amount);

    /**
     * @dev Constructor sets the contract owner
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Function to receive FTM sent to the contract
     */
    receive() external payable {
        emit TransferReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit TransferReceived(msg.sender, msg.value);
    }

    /**
     * @dev Modifier to only allow the owner to perform certain actions
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    /**
     * @dev Transfer FTM from the contract to another address
     * @param _to The address to receive FTM
     * @param _amount The amount of FTM to transfer (in wei)
     */
    function transferFTM(address payable _to, uint256 _amount) public onlyOwner {
        require(address(this).balance >= _amount, "The contract balance is insufficient");
        _to.transfer(_amount);
        emit TransferSent(msg.sender, _to, _amount);
    }

    /**
     * @dev Check the FTM balance of the contract
     * @return The FTM balance of the contract
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Check the FTM balance of any given address
     * @param _address The address to check the balance of
     * @return The FTM balance of the given address
     */
    function getBalanceOf(address _address) public view returns (uint256) {
        return _address.balance;
    }
}
