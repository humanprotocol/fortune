import Web3 from 'web3';
import React, { useState } from 'react';

let web3;

export default async function ChainId() {
    const [chainID, setChainID] = useState('');

    web3 = new Web3(window.ethereum);
    setChainID(await web3.eth.getChainId())
    if (chainID && chainID !== 0) {
        return chainID;
    }
    
}