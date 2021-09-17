pragma solidity >=0.4.22 <0.9.0;

import './Ownable.sol';
import './Priced.sol';
import "../interfaces/ERC721Metadata.sol";

contract CollectionsNFT is Ownable, Priced, ERC721Metadata {
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    event CollectionCreated(uint256 collectionId, address owner);

    mapping (address => uint256) public balanceOf;

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

    // APPROVAL SECTION

    mapping (uint256 => address) approved;
    // owner => operator list
    mapping (address => mapping(address => bool)) approvedOperators;

    function approve(address _approved, uint256 _tokenId) external payable {
        require(msg.sender == collections[_tokenId].owner || msg.sender == approved[_tokenId]);
        approved[_tokenId] = _approved;
        emit Approval(collections[_tokenId].owner, _approved, _tokenId);
    }

    function getApproved(uint256 _tokenId) external view returns (address) {
        require(_tokenId < collections.length);
        return approved[_tokenId];
    }

    function setApprovalForAll(address _operator, bool _approved) external payable {
        approvedOperators[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return approvedOperators[_owner][_operator];
    }


    // ERC721 METADATA
    string public name;
    string public symbol;

    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        return collections[_tokenId].uri;
    }
}
