const truffleAssert = require('truffle-assertions');
const {eventEmitted} = require("truffle-assertions");
require('chai').use(require('chai-as-promised')).should();

const Collections = artifacts.require("Collections");

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

contract('Collections', (accounts) => {
    describe('deployment', () => {
        let instance;
        before(async () => {
            instance = await Collections.deployed();
        })

        it('deploys successfully', async () => {
            assert.notEqual(instance.address, '')
            assert.notEqual(instance.address, 0x0)
            assert.notEqual(instance.address, undefined)
            assert.notEqual(instance.address, null)
            assert.equal(await ethBalance(instance.address), 0)
        })
    })

    describe('contract tests', () => {
        let instance;
        beforeEach(async () => {
            instance = await Collections.deployed();
        })

        it('get admin when not populated', async () => {
            assert.equal(await instance.collections(0), 0x0000000000000000000000000000000000000000)
        })

        it('create collection and check admin', async () => {
            assert.equal(await instance.collectionsLength(), 0)

            let resultCollection = await instance.createCollection();

            assert.equal(await instance.collections(0), accounts[0])
            assert.equal(await instance.collectionsLength(), 1)
            event.emitted(resultCollection, 'CollectionCreated', {
                collectionId: 0,
                admin: accounts[0]
            }, 'Contract should return the correct event.');
        })
    })
})
