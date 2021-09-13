const truffleAssert = require('truffle-assertions');
require('chai').use(require('chai-as-promised')).should();

const Ownable = artifacts.require("Ownable");

const ethBalance = async (add) => web3.utils.fromWei(await web3.eth.getBalance(add), 'ether');

const event = {
    emitted: (result, name, obj, msg = '') => truffleAssert.eventEmitted(result, name, eventFilter(obj), msg),
    notEmitted: (result, name, obj, msg = '') => truffleAssert.eventNotEmitted(result, name, eventFilter(obj), msg),
}
const eventFilter = obj => !obj ? null : (ev) => {
    const k = Object.keys(obj)
    for (let i = 0; i < k.length; i++) {
        if (ev[k[i]] != obj[k[i]]) return false
    }
    return true
}

contract('Ownable', (accounts) => {
    describe('deployment', () => {
        let instance;

        before(async () => {
            instance = await Ownable.deployed();
        })

        it('deploys successfully', async () => {
            assert.notEqual(instance.address, '')
            assert.notEqual(instance.address, 0x0)
            assert.notEqual(instance.address, undefined)
            assert.notEqual(instance.address, null)
            assert.equal(await ethBalance(instance.address), 0)
        })

    })

    describe('ownable', () => {
        let instance;
        beforeEach(async () => {
            instance = await Ownable.deployed();
        })

        it('is owned by first address', async () => {
            assert.equal(await instance.owner(), accounts[0])
        })

        it('is transferred properly', async () => {
            assert.equal(await instance.owner(), accounts[0])

            let resultAddress = await instance.transferOwnership(accounts[1])
            assert.equal(await instance.owner(), accounts[1])

            event.emitted(resultAddress, 'OwnershipTransferred', {
                previousOwner: accounts[0],
                newOwner: accounts[1]
            }, 'Contract should return the correct event.');
        })

        it('cannot transfer ownership if sender is not the owner', async () => {
            assert.equal(await instance.owner(), accounts[1])

            const err = 'VM Exception while processing transaction: revert'

           await instance.transferOwnership(accounts[2], {
                from: accounts[4]
            }).should.be.rejectedWith(err);

            assert.equal(await instance.owner(), accounts[1])
        })

    })

})

