require('chai').use(require('chai-as-promised')).should();

const { Emitted } = require('./helpers/events.js')
const { ethBalance, weiBalance } = require('./helpers/balance.js')

const Collections = artifacts.require("Collections");

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
            await instance.createCollection().should.be.rejectedWith(err);
            assert.equal(await instance.collectionsLength(), 0)
        })

        it('cant create collection if no enough ETH is provided', async () => {
            const err = 'VM Exception while processing transaction: revert'

            assert.equal(await instance.collectionsLength(), 0)
            await instance.createCollection({ value: CREATE_CONTRACT_COST - 1 }).should.be.rejectedWith(err);
            assert.equal(await instance.collectionsLength(), 0)
        })

        it('create collection and check admin and length', async () => {
            const balance = await weiBalance(instance.address)

            assert.equal(await instance.collectionsLength(), 0)

            let resultCollection = await instance.createCollection({ value: CREATE_CONTRACT_COST });

            assert.equal(await instance.collections(0), accounts[0])

            assert.equal(balance + CREATE_CONTRACT_COST, await weiBalance(instance.address))

            assert.equal(await instance.collectionsLength(), 1)
            Emitted(resultCollection, 'CollectionCreated', {
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
            Emitted(resultCollection, 'CollectionCreated', {
                collectionId: 1,
                admin: accounts[1]
            }, 'Contract should return the correct event.');
        })

        it('cant transfer admin if not admin', async () => {
            const err = 'VM Exception while processing transaction: revert'
            await instance.transferAdmin(1, accounts[4], { from: accounts[0] }).should.be.rejectedWith(err);
        })

        it('transfer admin', async () => {
            assert.equal(await instance.collections(0), accounts[0])
            const result = await instance.transferAdmin(0, accounts[4], { from: accounts[0] })
            assert.equal(await instance.collections(0), accounts[4])

            Emitted(result, 'AdminTransferred', {
                collectionId: 0,
                prevAdmin: accounts[0],
                newAdmin: accounts[4],
            }, 'Contract should return the correct event.');
        })

        it('admin can burn collection ownership', async () => {
            assert.equal(await instance.collections(0), accounts[4])
            const result = await instance.transferAdmin(0, '0x0000000000000000000000000000000000000000', { from: accounts[4] })
            assert.equal(await instance.collections(0), '0x0000000000000000000000000000000000000000')

            Emitted(result, 'AdminTransferred', {
                collectionId: 0,
                prevAdmin: accounts[4],
                newAdmin: '0x0000000000000000000000000000000000000000',
            }, 'Contract should return the correct event.');
        })

        it('cant update cost if not owner', async () => {
            assert.equal(await instance.cost(), CREATE_CONTRACT_COST)
            const err = 'VM Exception while processing transaction: revert'
            await instance.updateCost(200, { from: accounts[4] }).should.be.rejectedWith(err);
            assert.equal(await instance.cost(), CREATE_CONTRACT_COST)
        })

        it('cost is updated', async () => {
            assert.equal(await instance.cost(), CREATE_CONTRACT_COST)
            let result = await instance.updateCost(200, { from: accounts[0] });
            assert.equal(await instance.cost(), 200)

            Emitted(result, 'CostUpdated', {
                newCost: 200,
            }, 'Contract should return the correct event.');
        })

        it('cant create collection if no enough ETH is provided', async () => {
            const err = 'VM Exception while processing transaction: revert'
            assert.equal(await instance.collectionsLength(), 2)
            await instance.createCollection({ value: 199 }).should.be.rejectedWith(err);
            assert.equal(await instance.collectionsLength(), 2)
        })
    })
})

