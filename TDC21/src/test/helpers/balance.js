const weiBalance = async (add) => +(await web3.eth.getBalance(add))
const ethBalance = async (add) => +(await web3.utils.fromWei(`${await weiBalance(add)}`, 'ether'));

module.exports = {
    weiBalance,
    ethBalance,
}
