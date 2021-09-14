const Collections = artifacts.require("Collections");

module.exports = function (deployer) {
  deployer.deploy(Collections);
};
