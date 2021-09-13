pragma solidity >=0.4.22 <0.9.0;

import '../interfaces/ERC173.sol';

contract Ownable is ERC173 {
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(owner == msg.sender);
        _;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        address prevOwner = owner;
        owner = _newOwner;
        emit OwnershipTransferred(prevOwner, owner);
    }
}
