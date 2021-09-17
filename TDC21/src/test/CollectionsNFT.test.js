require('chai').use(require('chai-as-promised')).should()

const { Emitted } = require('./helpers/events.js')
const { ethBalance, weiBalance } = require('./helpers/balance.js')

const CollectionsNFT = artifacts.require("CollectionsNFT")

const CREATE_CONTRACT_COST = 100

contract('CollectionsNFT', (accounts) => {
    let instance;
    beforeEach(async () => {
        instance = await CollectionsNFT.deployed();
    })

    describe('deployment', () => {
        it('deploys successfully', async () => {
            assert.notEqual(instance.address, '')
            assert.notEqual(instance.address, 0x0)
            assert.notEqual(instance.address, undefined)
            assert.notEqual(instance.address, null)
            assert.equal(await ethBalance(instance.address), 0)
        })
    })

    describe('ERC721Metadata', () => {
        it('check name and symbol', async () => {
            assert.equal(await instance.symbol(), "TDC21C")
            assert.equal(await instance.name(), "TDC21 Collections")
        });
    })

    describe('balanceOf', () => {
        it('initial balance is 0', async () => {
            assert.equal(await instance.balanceOf(accounts[0]), 0)
        })
    })

    describe('create collection', () => {
        it('error when no dinero amigo', async () => {
            const err = 'VM Exception while processing transaction: revert'
            await instance.createCollection("anUri").should.be.rejectedWith(err)
        });

        it('collection created', async () => {
            const balance = await weiBalance(instance.address)
            assert.equal(balance, 0)

            const result = await instance.createCollection("anUri", { value: CREATE_CONTRACT_COST })

            assert.equal(await instance.tokenURI(0), 'anUri')
            assert.equal(await instance.ownerOf(0), accounts[0])
            assert.equal(await instance.balanceOf(accounts[0]), 1)
            assert.equal(await weiBalance(instance.address), balance + CREATE_CONTRACT_COST)

            Emitted(result, 'CollectionCreated', {
                collectionId: 0,
                owner: accounts[0]
            }, 'Contract should return the correct event.');
        })

        it('balance rises when a nft is created', async () => {
            assert.equal(await instance.balanceOf(accounts[0]), 1)
        })
    })

    describe('cost', () => {
        it('cant update cost if not owner', async () => {
            assert.equal(await instance.price(), CREATE_CONTRACT_COST)
            const err = 'VM Exception while processing transaction: revert'
            await instance.updatePrice(200, { from: accounts[4] }).should.be.rejectedWith(err);
            assert.equal(await instance.price(), CREATE_CONTRACT_COST)
        })

        it('cost is updated', async () => {
            assert.equal(await instance.price(), CREATE_CONTRACT_COST)
            let result = await instance.updatePrice(200, { from: accounts[0] });
            assert.equal(await instance.price(), 200)

            Emitted(result, 'PriceUpdated', {
                newPrice: 200,
            }, 'Contract should return the correct event.');
        })
    });

    describe('Approval', () => {
        it('Should return 0x0 address if no approved yet', async () => {
            assert.equal(await instance.getApproved(0), 0)
        })

        it('Should throw if NFT doesnt exist', async () => {
            const err = 'VM Exception while processing transaction: revert'
            await instance.getApproved(7438).should.be.rejectedWith(err);
        })

        it('Should throw if sender is not owner or approved', async () => {
        })

        it('Approve if sender is not owner but is approved', async () => {
        })

        it('Approved that approves losses approval', async () => {
        })

        it('Approve collection as owner and getApproved', async () => {
            assert.equal(await instance.getApproved(0), 0)

            const result = await instance.approve(accounts[1], 0)
            Emitted(result, 'Approval', {
                _owner: accounts[0],
                _approved: accounts[1],
                _tokenId: 0,
            }, 'Contract should return the correct event.');

            assert.equal(await instance.getApproved(0), accounts[1])
        })

        it('Owner that approved can change approved wallet', async () => {
        })
    })
})

