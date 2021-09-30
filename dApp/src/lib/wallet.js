// TODO Check si está conectado
// TODO Check de la wallet que hay en metamask


import Web3 from 'web3'
import detectProvider from '@metamask/detect-provider'

const Connect = async () => {
    const provider = await detectProvider()
    if (!provider) return false;

    const web3 = new Web3(provider);

    const getAccount = async () => {
        const accounts = await ethereum.enable();
        return accounts[0]
    }

    const onAccountsChanged = (fn) => ethereum.on('accountsChanged', fn)
    const offAccountsChanged = (fn) => ethereum.removeListener('accountsChanged', fn)

    return {
        user: await getAccount(),
        onAccountsChanged,
        offAccountsChanged,
        web3,
        // ShinyShell: new web3.eth.Contract(ShinyShellManifest.abi, config.contracts.ShinyShell),

// import ICOManifest from '../contracts/ICO.json'
// ICO: new web3.eth.Contract(ICOManifest.abi, config.contracts.ICO),
    }
}

export {
    Connect
}
