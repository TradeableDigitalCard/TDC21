pragma solidity >=0.4.22 <0.9.0;

import './Ownable.sol';
//import "../interfaces/ERC721.sol";

contract CollectionsNFT is Ownable
//, ERC721
{
    event CollectionCreated(uint256 collectionId, address owner);

    event CostUpdated(uint256 newCost);

    mapping (address => uint256) public balanceOf  ;
    uint256 public cost = 100 wei;

    struct Collection{
        address owner;
        string uri;
    }

    Collection[] collections;

    //
    //    modifier onlyAdmin(uint256 collectionId) {
    //        require(msg.sender == collections[collectionId]);
    //        _;
    //    }

    function createCollection(string calldata _uri) external payable {
        Collection memory collection;
        collection.owner = msg.sender;
        collection.uri = _uri;
        collections.push(collection);
        balanceOf[msg.sender] ++  ;
        emit CollectionCreated(collections.length -1, msg.sender);
    }

    function updateCost(uint256 _cost) external onlyOwner {
        cost = _cost;
        emit CostUpdated(cost);
    }

}
