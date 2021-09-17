pragma solidity >=0.4.22 <0.9.0;

import './Ownable.sol';
import './Priced.sol';
import "../interfaces/ERC721Metadata.sol";

contract CollectionsNFT is Ownable, Priced, ERC721Metadata {

    event CollectionCreated(uint256 collectionId, address owner);

    mapping (address => uint256) public balanceOf;
    string public name;
    string public symbol;

    struct Collection{
        address owner;
        string uri;
    }

    Collection[] collections;

    constructor() public {
        price = 100 wei;
        name = "TDC21 Collections";
        symbol = "TDC21C";
    }

    function createCollection(string calldata _uri) external payable cost(price) {
        Collection memory collection;
        collection.owner = msg.sender;
        collection.uri = _uri;
        collections.push(collection);
        balanceOf[msg.sender] ++  ;
        emit CollectionCreated(collections.length -1, msg.sender);
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return collections[_tokenId].owner;
    }


    //METADATA
    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        return collections[_tokenId].uri;
    }
}
