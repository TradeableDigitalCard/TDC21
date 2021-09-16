const truffleAssert = require('truffle-assertions');
const {eventEmitted} = require("truffle-assertions");
require('chai').use(require('chai-as-promised')).should();

const CollectionsNFT = artifacts.require("CollectionsNFT");

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
    describe('deployment', () => {
        let instance;
        before(async () => {
            instance = await CollectionsNFT.deployed();
        })

        it('deploys successfully', async () => {
            assert.notEqual(instance.address, '')
            assert.notEqual(instance.address, 0x0)
            assert.notEqual(instance.address, undefined)
            assert.notEqual(instance.address, null)
            assert.equal(await ethBalance(instance.address), 0)
        })
    })

    describe('mint', () => {
        let instance;
        beforeEach(async () => {
            instance = await CollectionsNFT.deployed();
        })

        it('collection created', async () => {
            const result = await instance.createCollection("anUri");
            assert.equal(await instance.balanceOf(accounts[0]), 1)

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
        let instance;
        beforeEach(async () => {
            instance = await CollectionsNFT.deployed();
        })

        it('initial balance is 0', async () => {
            assert.equal(await instance.balanceOf(accounts[8]), 0)
        })

        it('balance rises when a nft is created', async () => {
            assert.equal(await instance.balanceOf(accounts[8]), 0)
        })
    })
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

