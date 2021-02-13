// SPDX-License-Identifier: UNLICENSED"

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract Wallet {
    
    address[] public approvers;
    mapping (address => bool) approvers_;
    uint public quorum;
    struct Transfer {
        uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool sent;
    }
    Transfer[] public transfers;
    uint public nextId;
    mapping (address => mapping(uint => bool)) public apprRecord;
    
    modifier onlyApprover() {
        require(approvers_[msg.sender] == true, "You are not allowed to approve");
        _;
    }
    
    
    constructor(address[] memory _approvers, uint _quorum) public {
        approvers = _approvers;
        quorum = _quorum;
        
        for(uint i = 0; i < _approvers.length; i++){
            approvers_[_approvers[i]] = true;
        }
    }
    
    function getApprovers() view external returns(address[] memory) {
        return approvers;
    }
    
    function createTransfer(address payable to, uint amount) external onlyApprover {
        transfers.push(Transfer(
            nextId,
            amount,
            to,
            0,
            false
        ));
        
        nextId++;
    }
    
    function getTransfers() view external returns(Transfer[] memory){
        return transfers;
    }
    
    function approveTransfer(uint id) external onlyApprover {
        require(transfers[id].sent == false, "transfer already sent");
        require(apprRecord[msg.sender][id] == false, "cannot approve again"); // this line doesnt make sense
        
        apprRecord[msg.sender][id] = true;
        transfers[id].approvals++;
        
        if(transfers[id].approvals == quorum){
            transfers[id].sent = true;
            transfers[id].to.transfer(transfers[id].amount);
        }
    }
    
    receive() payable external {}
}