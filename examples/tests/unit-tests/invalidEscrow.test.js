const Web3 = require('web3');
const escrowAbi = require('./contracts/EscrowAbi.json');
const invalidEscrowAbi = require('./contracts/InvalidEscrowAbi.json');
const hmtokenAbi = require('./contracts/HMTokenABI.json');
const { createEscrowFactory, createEscrow, fundEscrow, setupEscrow, setupAgents, sendFortune, calculateRewardAmount } = require('./fixtures');
const { urls, statusesMap, addresses, escrowFundAmount } = require('./constants');
const web3 = new Web3(urls.ethHTTPServer);

describe('Invalid escrow', () => {
    test('Invalid escrow setup', async () => {
        const escrowFactory = createEscrowFactory();
        await createEscrow(escrowFactory);

        const lastEscrowAddr = await escrowFactory.methods.lastEscrow().call();
        const Escrow = new web3.eth.Contract(escrowAbi, lastEscrowAddr);
        let escrowSt = await Escrow.methods.status().call();

        expect(statusesMap[escrowSt]).toBe('Launched');
        expect(lastEscrowAddr).not.toBe('0x0000000000000000000000000000000000000000');

        await fundEscrow(lastEscrowAddr);

        // Bad repOracle address
        let res = await setupEscrow(lastEscrowAddr, repOracleAddress = 'BadAdress');
        expect(res.value).toBe('BadAdress');

        escrowSt = await Escrow.methods.status().call();
        expect(statusesMap[escrowSt]).toBe('Launched');

        // Bad recOracle address
        res = await setupEscrow(lastEscrowAddr, recOracleAddress = 'BadAdress');
        expect(res.value).toBe('BadAdress');

        escrowSt = await Escrow.methods.status().call();
        expect(statusesMap[escrowSt]).toBe('Launched');

        // Bad repOracle stake
        res = await setupEscrow(lastEscrowAddr, repOracleStake = 110);
        expect(res.value).toBe(110);

        escrowSt = await Escrow.methods.status().call();
        expect(statusesMap[escrowSt]).toBe('Launched');

        // Bad recOracle stake
        res = await setupEscrow(lastEscrowAddr, recOracleStake = 110);
        expect(res.value).toBe(110);

        escrowSt = await Escrow.methods.status().call();
        expect(statusesMap[escrowSt]).toBe('Launched');
    });

    test('Invalid escrow ABI', async () => {
        const escrowFactory = createEscrowFactory();
        await createEscrow(escrowFactory);

        const lastEscrowAddr = await escrowFactory.methods.lastEscrow().call();
        // Create an escrow with ABI not matches actual ABI
        const Escrow = new web3.eth.Contract(invalidEscrowAbi, lastEscrowAddr);
        let escrowSt = await Escrow.methods.status().call();

        expect(statusesMap[escrowSt]).toBe('Launched');
        expect(lastEscrowAddr).not.toBe('0x0000000000000000000000000000000000000000');

        await fundEscrow(lastEscrowAddr);
        let res = await setupEscrow(lastEscrowAddr, escrow = Escrow);
        expect(res.code).toBe('INVALID_ARGUMENT');

        escrowSt = await Escrow.methods.status().call();
        expect(statusesMap[escrowSt]).toBe('Launched');
    });

});