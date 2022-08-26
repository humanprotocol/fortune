const HDWalletProvider = require("@truffle/hdwallet-provider");
//load single private key as string

module.exports = {
  networks: {
    skale: {
      provider: () => new HDWalletProvider("3e4da933deecae77aed4618e0848145365486c65503efc76017a540275666ca6", 'https://staging-v2.skalenodes.com/v1/stocky-pleione'),
      networkCheckTimeout: 999999, 
      network_id: '1250011826715177',
    },
    development: {
      host: "0.0.0.0",
      port: 8547,
      network_id: "1337",
     }
   
  },
  compilers: {
    solc: {
      version: "0.6.2",
      settings: {
       optimizer: {
         enabled: false,
         runs: 200
       },
       evmVersion: "constantinople"
      }
    }
  },
};
/*skale --compile-all;truffle develop*/