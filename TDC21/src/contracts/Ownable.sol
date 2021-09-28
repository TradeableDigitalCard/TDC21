// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '../interfaces/ERC173.sol';

contract Ownable is ERC173 {

    address contractOwner;
    
    function owner() external view override returns(address) {
        return contractOwner;
    }

    constructor() {
        contractOwner = msg.sender;
    }

    modifier onlyOwner(){
        require(contractOwner == msg.sender);
        _;
    }

    function transferOwnership(address _newOwner) external override onlyOwner {
        require(_newOwner != address(0x0));
        address prevOwner = contractOwner;
        contractOwner = _newOwner;
        emit OwnershipTransferred(prevOwner, contractOwner);
    }
}
