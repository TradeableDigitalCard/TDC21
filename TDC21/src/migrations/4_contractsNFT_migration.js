const CollectionsNFT = artifacts.require("CollectionsNFT");

module.exports = function (deployer) {
  deployer.deploy(CollectionsNFT);
};
