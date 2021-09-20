pragma solidity >=0.4.22 <0.9.0;

import './Ownable.sol';
import './Priced.sol';
import "../interfaces/ERC721Metadata.sol";

contract CollectionsNFT is Ownable, Priced, ERC721Metadata {
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

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
        balanceOf[msg.sender]++;
        emit CollectionCreated(collections.length -1, msg.sender);
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return collections[_tokenId].owner;
    }

    // APPROVAL SECTION

    // owner => operator list
    mapping (address => mapping(address => bool)) approvedOperators;
    mapping (uint256 => address) approved;

    function setApprovalForAll(address _operator, bool _approved) external payable {
        approvedOperators[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return approvedOperators[_owner][_operator];
    }

    function approve(address _approved, uint256 _tokenId) external payable {
        require(msg.sender == collections[_tokenId].owner || msg.sender == approved[_tokenId]);
        approved[_tokenId] = _approved;
        emit Approval(collections[_tokenId].owner, _approved, _tokenId);
    }

    function getApproved(uint256 _tokenId) external view returns (address) {
        require(_tokenId < collections.length);
        return approved[_tokenId];
    }



    // TRANSFER SECTION

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT. When transfer is complete, this function
    ///  checks if `_to` is a smart contract (code size > 0). If so, it calls
    ///  `onERC721Received` on `_to` and throws if the return value is not
    ///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    // function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;


    /// @notice Transfers the ownership of an NFT from one address to another address


    /// When transfer is complete, this function  checks if `_to` is a smart contract (code size > 0).
    /// If so, it calls  `onERC721Received` on `_to` and throws if the return value is not
    ///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.

    /// This function just sets data to "".
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable {
        require(_tokenId < collections.length);
        require( msg.sender == collections[_tokenId].owner 
            || msg.sender == approved[_tokenId] 
            || approvedOperators[collections[_tokenId].owner][msg.sender]);

        require(_to != address(0x0));
        // require(_from == collections[_tokenId].owner, "pollas");

        // collections[_tokenId].owner = _to;
        // balanceOf[_from]--;
        // balanceOf[_to]++;

        // emit Transfer(_from, _to, _tokenId);
    }

    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    // function transferFrom(address _from, address _to, uint256 _tokenId) external payable;




    // ERC721 METADATA
    string public name;
    string public symbol;

    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        return collections[_tokenId].uri;
    }
}
