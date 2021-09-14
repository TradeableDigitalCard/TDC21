pragma solidity >=0.4.22 <0.9.0;

import './Ownable.sol';

contract Collections is Ownable {
    event AdminTransferred(uint256 collectionId, address prevAdmin, address newAdmin);
    event CollectionCreated(uint256 collectionId, address admin);

    mapping (uint256 => address) public collections;
    uint256 public collectionsLength;

    uint256 cost = 100 wei;

    modifier onlyAdmin(uint256 collectionId) {
        require(msg.sender == collections[collectionId]);
        _;
    }

    function updateCost(uint256 _cost) external onlyOwner {
        cost = _cost;
    }

    function createCollection() external payable returns (uint collectionID) {
        require(msg.value >= cost);
        collections[collectionsLength] = msg.sender;
        emit CollectionCreated(collectionsLength, msg.sender);
        collectionsLength++;
        return collectionsLength - 1;
    }

    function transferAdmin(uint256 collectionId, address newAdmin) external onlyAdmin(collectionId) {
        collections[collectionId] = newAdmin;
        emit AdminTransferred(collectionId, msg.sender, newAdmin);
    }
}
