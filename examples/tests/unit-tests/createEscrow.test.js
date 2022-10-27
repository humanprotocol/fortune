const Web3 = require('web3');
const escrowAbi = require('./contracts/EscrowAbi.json');
const { createEscrowFactory, createEscrow} = require('./fixtures');
const { urls, statusesMap} = require('./constants');
const web3 = new Web3(urls.ethHTTPServer);

describe('Create escrow', () => {
    test('Flow', async () => {
        const escrowFactory = createEscrowFactory();
        await createEscrow(escrowFactory);

        const lastEscrowAddr = await escrowFactory.methods.lastEscrow().call();
        const Escrow = new web3.eth.Contract(escrowAbi, lastEscrowAddr);
        let escrowSt = await Escrow.methods.status().call();

        expect(statusesMap[escrowSt]).toBe('Launched');
        expect(lastEscrowAddr).not.toBe('0x0000000000000000000000000000000000000000');

    });
});