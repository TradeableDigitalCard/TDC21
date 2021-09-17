pragma solidity >=0.4.22 <0.9.0;

import './Ownable.sol';
import './Priced.sol';
import "../interfaces/ERC721Metadata.sol";

contract CollectionsNFT is Ownable, Priced, ERC721Metadata {
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

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


    // APPROVAL

    mapping (uint256 => address) approved;

    function approve(address _approved, uint256 _tokenId) external payable {
        require(msg.sender == collections[_tokenId].owner || msg.sender == approved[_tokenId]);
        approved[_tokenId] = _approved;
        emit Approval(collections[_tokenId].owner, _approved, _tokenId);
    }

    function getApproved(uint256 _tokenId) external view returns (address) {
        require(_tokenId < collections.length);
        return approved[_tokenId];
    }



    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets
    /// @dev Emits the ApprovalForAll event. The contract MUST allow
    ///  multiple operators per owner.
    /// @param _operator Address to add to the set of authorized operators
    /// @param _approved True if the operator is approved, false to revoke approval
    // function setApprovalForAll(address _operator, bool _approved) external;

    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    // function isApprovedForAll(address _owner, address _operator) external view returns (bool);


    // ERC721 METADATA
    string public name;
    string public symbol;

    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        return collections[_tokenId].uri;
    }
}
