// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface ERC173 {
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    function owner() view external returns(address);
    function transferOwnership(address _newOwner) external;
}
