pragma solidity >=0.4.22 <0.9.0;

import './Ownable.sol';
//import "../interfaces/ERC721.sol";
import './Priced.sol';

contract CollectionsNFT is Ownable, Priced
//, ERC721
{
    event CollectionCreated(uint256 collectionId, address owner);

    mapping (address => uint256) public balanceOf  ;

    struct Collection{
        address owner;
        string uri;
    }

    Collection[] collections;

    constructor() public {
        price = 100 wei;
    }

    function createCollection(string calldata _uri) external payable cost(price) {
        Collection memory collection;
        collection.owner = msg.sender;
        collection.uri = _uri;
        collections.push(collection);
        balanceOf[msg.sender] ++  ;
        emit CollectionCreated(collections.length -1, msg.sender);
    }
}
