const truffleAssert = require('truffle-assertions')
const {eventEmitted} = require("truffle-assertions")
require('chai').use(require('chai-as-promised')).should()

const CollectionsNFT = artifacts.require("CollectionsNFT")

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

    describe('mint', () => {
        it('error when no dinero amigo', async () => {
            const err = 'VM Exception while processing transaction: revert'
            await instance.createCollection("anUri").should.be.rejectedWith(err)
        });

        it('collection created', async () => {
            assert.equal(await web3.eth.getBalance(instance.address), 0)
            const result = await instance.createCollection("anUri", {value: 100})
            assert.equal(await instance.balanceOf(accounts[0]), 1)
            assert.equal(await web3.eth.getBalance(instance.address), 100)

            event.emitted(result, 'CollectionCreated', {
                collectionId: 0,
                owner: accounts[0]
            }, 'Contract should return the correct event.');
        })

        it('balance rises when a nft is created', async () => {
            assert.equal(await instance.balanceOf(accounts[8]), 0)
        })
    })

    describe('balanceOf', () => {
        it('initial balance is 0', async () => {
            assert.equal(await instance.balanceOf(accounts[8]), 0)
        })

        it('balance rises when a nft is created', async () => {
            assert.equal(await instance.balanceOf(accounts[8]), 0)
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

            event.emitted(result, 'PriceUpdated', {
                newPrice: 200,
            }, 'Contract should return the correct event.');
        })
    });
    //
    // describe('ownerOf', () => {
    //     let instance;
    //     beforeEach(async () => {
    //         instance = await Collections.deployed();
    //     })
    //
    //     it('is transferred', async () => {
    //
    //     })
    // })
    //
    // describe('safeTransferFrom', () => {
    //     let instance;
    //     beforeEach(async () => {
    //         instance = await Collections.deployed();
    //     })
    //
    //     it('is transferred', async () => {
    //
    //     })
    // })
    //
    // describe('transferFrom', () => {
    //     let instance;
    //     beforeEach(async () => {
    //         instance = await Collections.deployed();
    //     })
    //
    //     it('is transferred', async () => {
    //
    //     })
    // })
    // describe('approve', () => {
    //     let instance;
    //     beforeEach(async () => {
    //         instance = await Collections.deployed();
    //     })
    //
    //     it('is transferred', async () => {
    //
    //     })
    // })
    //
    // describe('setApprovalForAll', () => {
    //     let instance;
    //     beforeEach(async () => {
    //         instance = await Collections.deployed();
    //     })
    //
    //     it('is transferred', async () => {
    //
    //     })
    // })
    //
    // describe('getApproved', () => {
    //     let instance;
    //     beforeEach(async () => {
    //         instance = await Collections.deployed();
    //     })
    //
    //     it('is transferred', async () => {
    //
    //     })
    // })
    //
    // describe('isApprovedForAll', () => {
    //     let instance;
    //     beforeEach(async () => {
    //         instance = await Collections.deployed();
    //     })
    //
    //     it('is transferred', async () => {
    //
    //     })
    // })
})

