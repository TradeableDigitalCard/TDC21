pragma solidity >=0.4.22 <0.9.0;


/*
    SmartContract TDC21 (baul)
        Collections [
            ... ids -> address (wallet)
        ]

        Items [
            ... NFTs -> CollectionId
        ]


    user -> create Collection - return collectionId - collectionId <-> walletId
    mint NFTs (collectionId, item, address forUser) .... collectionId ownerIs user
*/


   // EVENT AdminTransferred(collectionID, prevAdmin, newAdmin)
   // EVENT CollectionCreated(collectionID, admin)
   // GET admin(collectionID) address CREO QUE VA SOLO
   // MODIFIER onlyAdmin() require

contract Collections {

    event AdminTransferred(uint256 collectionId, address prevAdmin, address newAdmin);
    event CollectionCreated(uint256 collectionId, address admin);

    mapping (uint256 => address) public collections;

    modifier onlyAdmin(uint256 collectionId) {
        require(msg.sender == collections[collectionId]);
        _;
    }

   // transferAdmin(collectionId, newAdmin) emit AdminTransferred

   // createCollection() payable, ret collectionID emit CollectionCreated

}
