const Ownable = artifacts.require("Ownable");

const ethBalance = async (add) => web3.utils.fromWei(await web3.eth.getBalance(add), 'ether');

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
})

