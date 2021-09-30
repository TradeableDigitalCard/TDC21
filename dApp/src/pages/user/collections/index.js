import { useState, useEffect } from 'react'
import { Connect } from '/lib/wallet'

const CollectionSchema = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
        },
        "owner": {
            "type": "string",
        },
        "uri": {
            "type": "string",
        },
    }
}

const Collections = () => {
    const [user, setUser] = useState('')
    const [collections, setCollections] = useState([])

    useEffect(async () => {
        const wallet = await Connect()
        setUser(wallet.user)

        wallet.onAccountsChanged(setUser)

        return () => wallet.offAccountsChanged(setUser)
    }, [])

    useEffect(async () => {
        if (!user.length) return setCollections([])
        const c = await fetchCollections()
        setCollections(c)
    }, [user])

    const fetchCollections = async () => {
        return [
            {
                id: '0',
                owner: user,
                uri: 'asldfkj',
            },
        ]
    }

    const handleConnectWallet = () => {
        Connect()
    }

    return (
        <>
        <h1> Colecciones { user }</h1>
        { !user.length && <button onClick={ handleConnectWallet }>Connect Wallet</button> }

        {
            collections.map(c => <div key={ c.id }> { JSON.stringify(c) } </div>)
        }
        </>
    )
}

export default Collections
