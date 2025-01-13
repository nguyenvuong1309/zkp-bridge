// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./Verifier.sol";
import "./DAOWallet.sol";

contract DAOCheck is Pausable, ReentrancyGuard {

    enum Role {
        UNAUTHORIZED,
        GOVERNANCE
    }

    mapping(uint256 => bool) public wallets; // commitment made by hashing DAO ID with the secret 
    mapping(uint256 => address) public walletToAddress;
    mapping(address => uint256) public addressToWallet;
    mapping(uint256 => uint256) public walletToDuty;

    mapping(uint256 => uint256) public balances; // commitment -> balance
    mapping(uint256 => uint256) public duties; // commitment -> duty

    Verifier public verifier;

    mapping(address => Role) private permissions;

    // Merkle tree that consists of commitments
    uint256 public root;
    mapping(uint256 => uint256) public leaves;
    uint256 public leafCount;

    event NewWallet(uint256 commitment, uint256 duty, address walletAddress);

    constructor(address _verifier) {
        permissions[msg.sender] = Role.GOVERNANCE;

        verifier = Verifier(_verifier);
    }

    /// @notice create an on-chain wallet for the given DAO (ex. 10% uses 10000)
    function create(uint256 _commitment, uint256 _duty) external nonReentrant whenNotPaused {
        require( wallets[_commitment] ==  false, "The DAO's wallet is already created");
        require( 10000 > _duty ,"Invalid duty rates" );

        // Deploy DAOWallet contract
        DAOWallet wallet = new DAOWallet(
            address(this),
            _commitment,
            _duty
        );

        address walletAddress = address(wallet);

        wallets[_commitment] = true;
        walletToAddress[_commitment] = walletAddress;
        addressToWallet[walletAddress] = _commitment;
        walletToDuty[_commitment] = _duty;

        // add to leaves
        leaves[leafCount] = _commitment;
        leafCount += 1;

        emit NewWallet(_commitment, _duty, walletAddress);
    }

    /// @notice update the merkle root
    function updateRoot(uint256[24] calldata _proof, uint256 _root) external nonReentrant whenNotPaused {

        // FIXME: failing when provide the root that has been submitted

        if (root == 0) {
            root = _root;
        } else {
            // verify merkle root
            require(
                (verifier).verifyProof(_proof, [_root]),
                "SNARK verification failed"
            );
            root = _root;
        }

    }

    /// @notice withdraw payments
    function withdraw(uint256[24] calldata proof, uint256 _commitment, uint256 _amount,  address _toAddress) external nonReentrant whenNotPaused {
        require( wallets[_commitment] ==  true, "Invalid commitment");
        require( balances[_commitment] >= _amount, "Insufficient amount");

        require(
            (verifier).verifyProof(proof, [root]),
            "SNARK verification failed"
        );

        (bool success, ) = _toAddress.call{value: _amount}("");
        require(success, "Failed to send Ether");

        balances[_commitment] -= _amount;
    }

    /// @notice withdraw duties
    function withdrawDuty(uint256[24] calldata proof, uint256 _commitment, uint256 _amount, address _toAddress) external nonReentrant whenNotPaused {
        require( wallets[_commitment] ==  true, "Invalid commitment");
        require( duties[_commitment] >= _amount, "Insufficient amount");

        require(
            (verifier).verifyProof(proof, [root]),
            "SNARK verification failed"
        );

        (bool success, ) = _toAddress.call{value: _amount}("");
        require(success, "Failed to send Ether");

        duties[_commitment] -= _amount;
    }

    // ONLY GOVERNANCE

    /// @notice give a specific permission to the given address
    function grant(address _address, Role _role) external onlyGovernance {
        require(_address != msg.sender, "You cannot grant yourself");
        permissions[_address] = _role;
    }

    /// @notice remove any permission binded to the given address
    function revoke(address _address) external onlyGovernance {
        require(_address != msg.sender, "You cannot revoke yourself");
        permissions[_address] = Role.UNAUTHORIZED;
    }

    /// @notice pause the contract
    function setPaused(bool _paused) external onlyGovernance {
        if (_paused) {
            _pause();
        } else {
            _unpause();
        }
    }

    /// @notice override the merkle root
    function overrideRoot(uint256 _root) external onlyGovernance {
        root = _root;
    }

    modifier onlyGovernance() {
        require(
            permissions[msg.sender] == Role.GOVERNANCE,
            "Caller is not the governance"
        );
        _;
    }

    receive() external payable {
        
        if (addressToWallet[msg.sender] != 0) {
           uint256 commitment =  addressToWallet[msg.sender];

           uint256 amount = msg.value;
           uint256 dutyRate = walletToDuty[commitment];

            if (dutyRate > 0) {
                uint256 dutyAmount = (amount * dutyRate) / 10000;
                uint256 remaining = amount - dutyAmount;

                balances[commitment] += remaining;
                duties[commitment] += dutyAmount;
            } else {
                balances[commitment] += amount;
            }
        }

    }
}