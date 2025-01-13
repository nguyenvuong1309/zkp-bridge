// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; 

// A public registry to track all legally registered DAOs, where the ID will be mandatory to produce a commitment for an anonymous withdrawal.

// TODO: the production version will use an IPFS hash instead of an increment ID.

contract DAORegistry is ReentrancyGuard {

    struct DAO {
        bytes32 name;
        bytes32 addr; // allows only 128 characters
        bytes32 jurisdiction;
        bool isParent;
        uint256 parentId;
        bool discontinued;
        address representative;
    }

    mapping(uint256 => DAO) public gazettes;
    uint256 public daoCount;

    event NewDAO(uint256 daoId, bytes32 name, bool isParent, address representative);

    /// @notice register a new dao
    function register(
        bytes32 _name, 
        bytes32 _addr, 
        bytes32 _jurisdiction,
        bool _isParent,
        uint256 _parentId // set to 0 if none
    ) external nonReentrant  {

        daoCount += 1;

        gazettes[daoCount].name = _name;
        gazettes[daoCount].addr = _addr;
        gazettes[daoCount].jurisdiction = _jurisdiction;
        gazettes[daoCount].isParent = _isParent;
        gazettes[daoCount].parentId = _parentId;
        gazettes[daoCount].representative = msg.sender;

        emit NewDAO(daoCount, _name, _isParent, msg.sender);
    }

    /// @notice remove the dao from the list
    function disable(uint256 _daoId) external onlyDaoOwner(_daoId) {
        gazettes[_daoId].discontinued = true;
    }

    /// @notice bring the dao back
    function enable(uint256 _daoId) external onlyDaoOwner(_daoId) {
        gazettes[_daoId].discontinued = false;
    }

    /// @notice update dao name
    function updateDaoName(uint256 _daoId, bytes32 _name) external onlyDaoOwner(_daoId) {
         gazettes[_daoId].name = _name;
    }

    /// @notice update dao address
    function updateDaoAddress(uint256 _daoId, bytes32 _addr) external onlyDaoOwner(_daoId) {
        gazettes[daoCount].addr = _addr;
    }

    /// @notice update dao jurisdiction
    function updateDaoJurisdiction(uint256 _daoId, bytes32 _jurisdiction) external onlyDaoOwner(_daoId) {
        gazettes[daoCount].jurisdiction = _jurisdiction;
    }

    modifier onlyDaoOwner(uint256 daoId ) {
        require(
            gazettes[daoId].representative == msg.sender,
            "Invalid caller"
        );
        _;
    }
}