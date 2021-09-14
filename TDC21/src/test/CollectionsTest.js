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


const CREATE_CONTRACT_COST = 100

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

        it('cant create collection if no ETH is provided', async () => {
            const err = 'VM Exception while processing transaction: revert'

            assert.equal(await instance.collectionsLength(), 0)
            let resultCollection = await instance.createCollection().should.be.rejectedWith(err);
            assert.equal(await instance.collectionsLength(), 0)
        })

        it('cant create collection if no enough ETH is provided', async () => {
            const err = 'VM Exception while processing transaction: revert'

            assert.equal(await instance.collectionsLength(), 0)
            let resultCollection = await instance.createCollection({ value: CREATE_CONTRACT_COST - 1 }).should.be.rejectedWith(err);
            assert.equal(await instance.collectionsLength(), 0)
        })

        it('create collection and check admin and length', async () => {
            const balance = +(await web3.eth.getBalance(instance.address))

            assert.equal(await instance.collectionsLength(), 0)

            let resultCollection = await instance.createCollection({ value: CREATE_CONTRACT_COST });

            assert.equal(await instance.collections(0), accounts[0])

            assert.equal(balance + CREATE_CONTRACT_COST, await web3.eth.getBalance(instance.address))

            assert.equal(await instance.collectionsLength(), 1)
            event.emitted(resultCollection, 'CollectionCreated', {
                collectionId: 0,
                admin: accounts[0]
            }, 'Contract should return the correct event.');
        })

        it('create another collection and check admin and length', async () => {
            assert.equal(await instance.collectionsLength(), 1)

            let resultCollection = await instance.createCollection({
                from: accounts[1],
                value: CREATE_CONTRACT_COST,
            });

            assert.equal(await instance.collections(1), accounts[1])
            assert.equal(await instance.collectionsLength(), 2)
            event.emitted(resultCollection, 'CollectionCreated', {
                collectionId: 1,
                admin: accounts[1]
            }, 'Contract should return the correct event.');
        })

        it('cant transfer admin if not admin', async () => {
            const err = 'VM Exception while processing transaction: revert'
            const result = await instance.transferAdmin(1, accounts[4], { from: accounts[0] }).should.be.rejectedWith(err);
        })

        it('transfer admin', async () => {
            assert.equal(await instance.collections(0), accounts[0])
            const result = await instance.transferAdmin(0, accounts[4], { from: accounts[0] })
            assert.equal(await instance.collections(0), accounts[4])

            event.emitted(result, 'AdminTransferred', {
                collectionId: 0,
                prevAdmin: accounts[0],
                newAdmin: accounts[4],
            }, 'Contract should return the correct event.');
        })

        it('admin can burn collection ownership', async () => {
            assert.equal(await instance.collections(0), accounts[4])
            const result = await instance.transferAdmin(0, '0x0000000000000000000000000000000000000000', { from: accounts[4] })
            assert.equal(await instance.collections(0), '0x0000000000000000000000000000000000000000')

            event.emitted(result, 'AdminTransferred', {
                collectionId: 0,
                prevAdmin: accounts[4],
                newAdmin: '0x0000000000000000000000000000000000000000',
            }, 'Contract should return the correct event.');
        })
    })
})

