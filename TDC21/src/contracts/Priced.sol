pragma solidity >=0.4.22 <0.9.0;

import './Ownable.sol';

contract Priced is Ownable {

    event PriceUpdated(uint256 newPrice);
    uint256 public price;

    function updatePrice(uint256 _price) external onlyOwner {
        price = _price;
        emit PriceUpdated(price);
    }

    modifier cost(uint256 _price) {
        require(msg.value >= _price);
        _;
    }
}