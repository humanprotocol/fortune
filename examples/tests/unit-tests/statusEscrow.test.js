const Web3 = require('web3');
const escrowAbi = require('./contracts/EscrowAbi.json');
const hmtokenAbi = require('./contracts/HMTokenABI.json');
const { createEscrowFactory, createEscrow, fundEscrow, setupEscrow, setupAgents, sendFortune, calculateRewardAmount } = require('./fixtures');
const { urls, statusesMap, addresses, escrowFundAmount } = require('./constants');
const web3 = new Web3(urls.ethHTTPServer);

describe('Positive flow', () => {
    test('Flow', async () => {
        const escrowFactory = createEscrowFactory();
        await createEscrow(escrowFactory);

        const lastEscrowAddr = await escrowFactory.methods.lastEscrow().call();
        const Escrow = new web3.eth.Contract(escrowAbi, lastEscrowAddr);
        let escrowSt = await Escrow.methods.status().call();

        expect(statusesMap[escrowSt]).toBe('Launched');
        expect(lastEscrowAddr).not.toBe('0x0000000000000000000000000000000000000000');

        await fundEscrow(lastEscrowAddr);
        await setupEscrow(lastEscrowAddr);

        escrowSt = await Escrow.methods.status().call();
        expect(statusesMap[escrowSt]).toBe('Pending');
    });
});